from datetime import datetime
import re

from fastapi import Depends, FastAPI, Header, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import asc, desc, func, select
from sqlalchemy.orm import Session, joinedload

import models
import schemas
from database import SessionLocal, engine
from security import (
    generate_session_token,
    hash_password,
    hash_session_token,
    session_expiry,
    verify_password,
)

EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="RigCraft API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def parse_bearer_token(authorization: str | None) -> str:
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization token")
    prefix = "Bearer "
    if not authorization.startswith(prefix):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    token = authorization[len(prefix) :].strip()
    if not token:
        raise HTTPException(status_code=401, detail="Empty token")
    return token


def get_current_user(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> models.User:
    token = parse_bearer_token(authorization)
    token_hash = hash_session_token(token)

    session = db.scalar(
        select(models.AuthSession)
        .where(models.AuthSession.token_hash == token_hash)
        .where(models.AuthSession.revoked_at.is_(None))
    )
    if not session:
        raise HTTPException(status_code=401, detail="Session expired or invalid")

    if session.expires_at <= datetime.utcnow():
        session.revoked_at = datetime.utcnow()
        db.commit()
        raise HTTPException(status_code=401, detail="Session expired or invalid")

    user = db.scalar(
        select(models.User)
        .where(models.User.id == session.user_id)
        .options(joinedload(models.User.role))
    )
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user


def require_admin(current_user: models.User = Depends(get_current_user)) -> models.User:
    if not current_user.role or current_user.role.name != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


def get_current_session(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> models.AuthSession:
    token = parse_bearer_token(authorization)
    token_hash = hash_session_token(token)
    session = db.scalar(select(models.AuthSession).where(models.AuthSession.token_hash == token_hash))
    if not session:
        raise HTTPException(status_code=401, detail="Session not found")
    return session


def user_payload(user: models.User) -> schemas.UserRead:
    return schemas.UserRead(
        id=user.id,
        email=user.email,
        display_name=user.display_name,
        role_id=user.role_id,
        role_name=user.role.name if user.role else "member",
    )


def ensure_valid_email(email: str):
    if not EMAIL_PATTERN.match(email):
        raise HTTPException(status_code=400, detail="Invalid email format")


def seed_if_needed(db: Session):
    role_count = db.scalar(select(func.count(models.Role.id)))
    if role_count and role_count > 0:
        return

    admin_role = models.Role(name="admin", description="Admin user")
    member_role = models.Role(name="member", description="Registered user")
    visitor_role = models.Role(name="visitor", description="Visitor")
    db.add_all([admin_role, member_role, visitor_role])
    db.flush()

    users = [
        models.User(
            email="admin@rigcraft.hu",
            password_hash=hash_password("Admin123!"),
            display_name="Admin",
            role_id=admin_role.id,
        ),
        models.User(
            email="richard@rigcraft.hu",
            password_hash=hash_password("Richard123!"),
            display_name="Richard",
            role_id=member_role.id,
        ),
    ]
    db.add_all(users)
    db.flush()

    categories = [
        models.Category(name="CPU", slug="cpu"),
        models.Category(name="GPU", slug="gpu"),
        models.Category(name="RAM", slug="ram"),
        models.Category(name="Storage", slug="storage"),
        models.Category(name="Motherboard", slug="motherboard"),
    ]
    db.add_all(categories)
    db.flush()

    category_lookup = {cat.name: cat.id for cat in categories}
    components = [
        models.Component(
            category_id=category_lookup["CPU"],
            name="Ryzen 5 7600",
            brand="AMD",
            socket_or_standard="AM5",
            price_huf=89900,
            watt_usage=65,
            stock_status="in_stock",
        ),
        models.Component(
            category_id=category_lookup["GPU"],
            name="RTX 4060",
            brand="NVIDIA",
            socket_or_standard="PCIe 4.0",
            price_huf=142000,
            watt_usage=115,
            stock_status="in_stock",
        ),
        models.Component(
            category_id=category_lookup["RAM"],
            name="32 GB DDR5 6000",
            brand="Kingston",
            socket_or_standard="DDR5",
            price_huf=48900,
            watt_usage=10,
            stock_status="low_stock",
        ),
        models.Component(
            category_id=category_lookup["Storage"],
            name="1 TB NVMe Gen4",
            brand="Samsung",
            socket_or_standard="M.2 NVMe",
            price_huf=35900,
            watt_usage=6,
            stock_status="in_stock",
        ),
        models.Component(
            category_id=category_lookup["Motherboard"],
            name="B650 ATX Board",
            brand="ASUS",
            socket_or_standard="AM5",
            price_huf=69900,
            watt_usage=35,
            stock_status="in_stock",
        ),
    ]
    db.add_all(components)
    db.flush()

    config = models.Configuration(
        user_id=users[1].id,
        name="Esport Sprint",
        goal="High FPS gaming",
        is_public=True,
        total_price_huf=0,
    )
    db.add(config)
    db.flush()

    config_items = [
        models.ConfigurationItem(configuration_id=config.id, component_id=components[0].id, quantity=1),
        models.ConfigurationItem(configuration_id=config.id, component_id=components[1].id, quantity=1),
        models.ConfigurationItem(configuration_id=config.id, component_id=components[2].id, quantity=1),
    ]
    db.add_all(config_items)

    comparison = models.Comparison(user_id=users[1].id, title="Gaming buildek")
    db.add(comparison)
    db.flush()
    db.add(models.ComparisonItem(comparison_id=comparison.id, configuration_id=config.id, rank_order=1))

    recalc_configuration_total(db, config)
    db.commit()


def recalc_configuration_total(db: Session, configuration: models.Configuration):
    db.refresh(configuration)
    total = 0
    items = db.scalars(
        select(models.ConfigurationItem)
        .where(models.ConfigurationItem.configuration_id == configuration.id)
        .options(joinedload(models.ConfigurationItem.component))
    ).all()
    for item in items:
        if item.component:
            total += item.component.price_huf * item.quantity
    configuration.total_price_huf = total


@app.on_event("startup")
def on_startup():
    with SessionLocal() as db:
        seed_if_needed(db)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/auth/register", response_model=schemas.AuthTokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: schemas.AuthRegisterRequest, db: Session = Depends(get_db)):
    ensure_valid_email(payload.email.strip().lower())
    existing = db.scalar(select(models.User).where(models.User.email == payload.email.strip().lower()))
    if existing:
        raise HTTPException(status_code=400, detail="Email already in use")

    has_upper = any(char.isupper() for char in payload.password)
    has_digit = any(char.isdigit() for char in payload.password)
    has_symbol = any(not char.isalnum() for char in payload.password)
    if not (has_upper and has_digit and has_symbol):
        raise HTTPException(
            status_code=400,
            detail="Password must contain uppercase letter, number and symbol",
        )

    member_role = db.scalar(select(models.Role).where(models.Role.name == "member"))
    if not member_role:
        raise HTTPException(status_code=500, detail="Role setup error")

    user = models.User(
        email=payload.email.strip().lower(),
        password_hash=hash_password(payload.password),
        display_name=payload.display_name.strip(),
        role_id=member_role.id,
    )
    db.add(user)
    db.flush()

    plain_token = generate_session_token()
    db.add(
        models.AuthSession(
            user_id=user.id,
            token_hash=hash_session_token(plain_token),
            expires_at=session_expiry(),
        )
    )
    db.commit()

    created_user = db.scalar(
        select(models.User).where(models.User.id == user.id).options(joinedload(models.User.role))
    )
    if not created_user:
        raise HTTPException(status_code=500, detail="User creation failed")

    return schemas.AuthTokenResponse(token=plain_token, user=user_payload(created_user))


@app.post("/auth/login", response_model=schemas.AuthTokenResponse)
def login(payload: schemas.AuthLoginRequest, db: Session = Depends(get_db)):
    ensure_valid_email(payload.email.strip().lower())
    user = db.scalar(
        select(models.User)
        .where(models.User.email == payload.email.strip().lower())
        .options(joinedload(models.User.role))
    )
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not user.password_hash.startswith("$pbkdf2-sha256$"):
        user.password_hash = hash_password(payload.password)
        db.commit()
        db.refresh(user)

    plain_token = generate_session_token()
    db.add(
        models.AuthSession(
            user_id=user.id,
            token_hash=hash_session_token(plain_token),
            expires_at=session_expiry(),
        )
    )
    db.commit()

    return schemas.AuthTokenResponse(token=plain_token, user=user_payload(user))


@app.post("/auth/logout", response_model=schemas.MessageResponse)
def logout(
    session: models.AuthSession = Depends(get_current_session),
    db: Session = Depends(get_db),
):
    session.revoked_at = datetime.utcnow()
    db.commit()
    return schemas.MessageResponse(message="Logged out")


@app.get("/auth/me", response_model=schemas.UserRead)
def auth_me(current_user: models.User = Depends(get_current_user)):
    return user_payload(current_user)


@app.get("/roles", response_model=list[schemas.RoleRead])
def get_roles(db: Session = Depends(get_db)):
    return db.scalars(select(models.Role).order_by(models.Role.id)).all()


@app.get("/users", response_model=list[schemas.UserRead])
def get_users(db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    users = db.scalars(select(models.User).options(joinedload(models.User.role)).order_by(models.User.id)).all()
    return [user_payload(user) for user in users]


@app.get("/stats", response_model=schemas.StatsRead)
def get_stats(db: Session = Depends(get_db)):
    return schemas.StatsRead(
        categories=db.scalar(select(func.count(models.Category.id))) or 0,
        components=db.scalar(select(func.count(models.Component.id))) or 0,
        configurations=db.scalar(select(func.count(models.Configuration.id))) or 0,
        comparisons=db.scalar(select(func.count(models.Comparison.id))) or 0,
    )


@app.get("/categories", response_model=list[schemas.CategoryRead])
def list_categories(db: Session = Depends(get_db)):
    return db.scalars(select(models.Category).order_by(models.Category.name)).all()


@app.post("/categories", response_model=schemas.CategoryRead, status_code=status.HTTP_201_CREATED)
def create_category(
    payload: schemas.CategoryCreate,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin),
):
    category = models.Category(name=payload.name.strip(), slug=payload.slug.strip().lower())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


@app.put("/categories/{category_id}", response_model=schemas.CategoryRead)
def update_category(
    category_id: int,
    payload: schemas.CategoryUpdate,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin),
):
    category = db.get(models.Category, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    category.name = payload.name.strip()
    category.slug = payload.slug.strip().lower()
    db.commit()
    db.refresh(category)
    return category


@app.delete("/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin),
):
    category = db.get(models.Category, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    linked_components = db.scalar(
        select(func.count(models.Component.id)).where(models.Component.category_id == category_id)
    )
    if linked_components and linked_components > 0:
        raise HTTPException(status_code=400, detail="Category has related components")

    db.delete(category)
    db.commit()
    return None


@app.get("/components", response_model=list[schemas.ComponentRead])
def list_components(
    q: str | None = Query(default=None),
    category_id: int | None = Query(default=None),
    sort: str = Query(default="price_asc"),
    db: Session = Depends(get_db),
):
    query = select(models.Component).options(joinedload(models.Component.category))

    if q:
        query = query.where(models.Component.name.ilike(f"%{q.strip()}%"))
    if category_id:
        query = query.where(models.Component.category_id == category_id)

    if sort == "price_desc":
        query = query.order_by(desc(models.Component.price_huf))
    elif sort == "name_asc":
        query = query.order_by(asc(models.Component.name))
    else:
        query = query.order_by(asc(models.Component.price_huf))

    items = db.scalars(query).unique().all()
    return [
        schemas.ComponentRead(
            id=item.id,
            category_id=item.category_id,
            category_name=item.category.name if item.category else "Unknown",
            name=item.name,
            brand=item.brand,
            socket_or_standard=item.socket_or_standard,
            price_huf=item.price_huf,
            watt_usage=item.watt_usage,
            stock_status=item.stock_status,
            created_at=item.created_at,
        )
        for item in items
    ]


@app.post("/components", response_model=schemas.ComponentRead, status_code=status.HTTP_201_CREATED)
def create_component(
    payload: schemas.ComponentCreate,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin),
):
    category = db.get(models.Category, payload.category_id)
    if not category:
        raise HTTPException(status_code=400, detail="Invalid category")

    component = models.Component(**payload.model_dump())
    db.add(component)
    db.commit()
    db.refresh(component)

    return schemas.ComponentRead(
        id=component.id,
        category_id=component.category_id,
        category_name=category.name,
        name=component.name,
        brand=component.brand,
        socket_or_standard=component.socket_or_standard,
        price_huf=component.price_huf,
        watt_usage=component.watt_usage,
        stock_status=component.stock_status,
        created_at=component.created_at,
    )


@app.put("/components/{component_id}", response_model=schemas.ComponentRead)
def update_component(
    component_id: int,
    payload: schemas.ComponentUpdate,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin),
):
    component = db.get(models.Component, component_id)
    if not component:
        raise HTTPException(status_code=404, detail="Component not found")

    category = db.get(models.Category, payload.category_id)
    if not category:
        raise HTTPException(status_code=400, detail="Invalid category")

    for key, value in payload.model_dump().items():
        setattr(component, key, value)

    db.commit()
    db.refresh(component)

    return schemas.ComponentRead(
        id=component.id,
        category_id=component.category_id,
        category_name=category.name,
        name=component.name,
        brand=component.brand,
        socket_or_standard=component.socket_or_standard,
        price_huf=component.price_huf,
        watt_usage=component.watt_usage,
        stock_status=component.stock_status,
        created_at=component.created_at,
    )


@app.delete("/components/{component_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_component(
    component_id: int,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin),
):
    component = db.get(models.Component, component_id)
    if not component:
        raise HTTPException(status_code=404, detail="Component not found")

    in_configs = db.scalar(
        select(func.count(models.ConfigurationItem.id)).where(models.ConfigurationItem.component_id == component_id)
    )
    if in_configs and in_configs > 0:
        raise HTTPException(status_code=400, detail="Component is used in a configuration")

    db.delete(component)
    db.commit()
    return None


def map_configuration(configuration: models.Configuration) -> schemas.ConfigurationRead:
    return schemas.ConfigurationRead(
        id=configuration.id,
        user_id=configuration.user_id,
        user_name=configuration.user.display_name if configuration.user else "Unknown",
        name=configuration.name,
        goal=configuration.goal,
        total_price_huf=configuration.total_price_huf,
        is_public=configuration.is_public,
        created_at=configuration.created_at,
        updated_at=configuration.updated_at,
        items=[
            schemas.ConfigurationItemRead(
                id=item.id,
                component_id=item.component_id,
                component_name=item.component.name if item.component else "Unknown",
                component_category_name=item.component.category.name if item.component and item.component.category else None,
                component_price_huf=item.component.price_huf if item.component else None,
                component_watt_usage=item.component.watt_usage if item.component else None,
                quantity=item.quantity,
                note=item.note,
            )
            for item in configuration.items
        ],
    )


@app.get("/configurations", response_model=list[schemas.ConfigurationRead])
def list_configurations(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    configs = db.scalars(
        select(models.Configuration)
        .where((models.Configuration.is_public.is_(True)) | (models.Configuration.user_id == current_user.id))
        .options(
            joinedload(models.Configuration.user),
            joinedload(models.Configuration.items)
            .joinedload(models.ConfigurationItem.component)
            .joinedload(models.Component.category),
        )
        .order_by(desc(models.Configuration.updated_at))
    ).unique().all()
    return [map_configuration(config) for config in configs]


@app.post("/configurations", response_model=schemas.ConfigurationRead, status_code=status.HTTP_201_CREATED)
def create_configuration(
    payload: schemas.ConfigurationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role and current_user.role.name != "admin" and payload.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only create your own configuration")

    user = db.get(models.User, payload.user_id)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid user")

    config = models.Configuration(
        user_id=payload.user_id,
        name=payload.name,
        goal=payload.goal,
        is_public=payload.is_public,
    )
    db.add(config)
    db.flush()

    for item in payload.items:
        component = db.get(models.Component, item.component_id)
        if not component:
            raise HTTPException(status_code=400, detail=f"Invalid component: {item.component_id}")
        db.add(
            models.ConfigurationItem(
                configuration_id=config.id,
                component_id=item.component_id,
                quantity=item.quantity,
                note=item.note,
            )
        )

    db.flush()
    recalc_configuration_total(db, config)
    db.commit()

    created = db.scalar(
        select(models.Configuration)
        .where(models.Configuration.id == config.id)
        .options(
            joinedload(models.Configuration.user),
            joinedload(models.Configuration.items)
            .joinedload(models.ConfigurationItem.component)
            .joinedload(models.Component.category),
        )
    )
    if not created:
        raise HTTPException(status_code=404, detail="Configuration not found")
    return map_configuration(created)


@app.put("/configurations/{configuration_id}", response_model=schemas.ConfigurationRead)
def update_configuration(
    configuration_id: int,
    payload: schemas.ConfigurationUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    config = db.get(models.Configuration, configuration_id)
    if not config:
        raise HTTPException(status_code=404, detail="Configuration not found")

    is_admin = current_user.role and current_user.role.name == "admin"
    if not is_admin and config.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only edit your own configuration")

    user = db.get(models.User, payload.user_id)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid user")

    config.user_id = payload.user_id
    config.name = payload.name
    config.goal = payload.goal
    config.is_public = payload.is_public

    old_items = db.scalars(
        select(models.ConfigurationItem).where(models.ConfigurationItem.configuration_id == configuration_id)
    ).all()
    for item in old_items:
        db.delete(item)

    for item in payload.items:
        component = db.get(models.Component, item.component_id)
        if not component:
            raise HTTPException(status_code=400, detail=f"Invalid component: {item.component_id}")
        db.add(
            models.ConfigurationItem(
                configuration_id=configuration_id,
                component_id=item.component_id,
                quantity=item.quantity,
                note=item.note,
            )
        )

    db.flush()
    recalc_configuration_total(db, config)
    db.commit()

    updated = db.scalar(
        select(models.Configuration)
        .where(models.Configuration.id == config.id)
        .options(
            joinedload(models.Configuration.user),
            joinedload(models.Configuration.items)
            .joinedload(models.ConfigurationItem.component)
            .joinedload(models.Component.category),
        )
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Configuration not found")
    return map_configuration(updated)


@app.delete("/configurations/{configuration_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_configuration(
    configuration_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    config = db.get(models.Configuration, configuration_id)
    if not config:
        raise HTTPException(status_code=404, detail="Configuration not found")

    is_admin = current_user.role and current_user.role.name == "admin"
    if not is_admin and config.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only delete your own configuration")

    db.delete(config)
    db.commit()
    return None


def map_comparison(comparison: models.Comparison) -> schemas.ComparisonRead:
    return schemas.ComparisonRead(
        id=comparison.id,
        user_id=comparison.user_id,
        title=comparison.title,
        created_at=comparison.created_at,
        items=[
            schemas.ComparisonItemRead(
                id=item.id,
                configuration_id=item.configuration_id,
                configuration_name=item.configuration.name if item.configuration else "Unknown",
                rank_order=item.rank_order,
            )
            for item in sorted(comparison.items, key=lambda row: row.rank_order)
        ],
    )


@app.post("/comparisons", response_model=schemas.ComparisonRead, status_code=status.HTTP_201_CREATED)
def create_comparison(
    payload: schemas.ComparisonCreateRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    ids = []
    seen = set()
    for value in payload.configuration_ids:
        if value in seen:
            continue
        seen.add(value)
        ids.append(value)

    if len(ids) < 2:
        raise HTTPException(status_code=400, detail="At least 2 unique configurations are required")

    is_admin = current_user.role and current_user.role.name == "admin"
    visible_configs = db.scalars(
        select(models.Configuration).where(models.Configuration.id.in_(ids))
    ).all()
    visible_map = {cfg.id: cfg for cfg in visible_configs}

    for cfg_id in ids:
        cfg = visible_map.get(cfg_id)
        if not cfg:
            raise HTTPException(status_code=400, detail=f"Invalid configuration id: {cfg_id}")
        if not is_admin and not cfg.is_public and cfg.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="You can only compare your own or public configurations")

    comparison = models.Comparison(user_id=current_user.id, title=payload.title.strip())
    db.add(comparison)
    db.flush()

    for index, cfg_id in enumerate(ids, start=1):
        db.add(
            models.ComparisonItem(
                comparison_id=comparison.id,
                configuration_id=cfg_id,
                rank_order=index,
            )
        )

    db.commit()

    created = db.scalar(
        select(models.Comparison)
        .where(models.Comparison.id == comparison.id)
        .options(joinedload(models.Comparison.items).joinedload(models.ComparisonItem.configuration))
    )
    if not created:
        raise HTTPException(status_code=404, detail="Comparison not found")
    return map_comparison(created)


@app.get("/comparisons", response_model=list[schemas.ComparisonRead])
def list_comparisons(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    comps = db.scalars(
        select(models.Comparison)
        .where(models.Comparison.user_id == current_user.id)
        .options(
            joinedload(models.Comparison.items)
            .joinedload(models.ComparisonItem.configuration),
        )
        .order_by(desc(models.Comparison.created_at))
    ).unique().all()

    return [map_comparison(comparison) for comparison in comps]
