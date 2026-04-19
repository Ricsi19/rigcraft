from datetime import datetime

from pydantic import BaseModel, Field


class AuthRegisterRequest(BaseModel):
    email: str = Field(min_length=5, max_length=120)
    display_name: str = Field(min_length=2, max_length=80)
    password: str = Field(min_length=8, max_length=128)


class AuthLoginRequest(BaseModel):
    email: str = Field(min_length=5, max_length=120)
    password: str = Field(min_length=8, max_length=128)


class RoleRead(BaseModel):
    id: int
    name: str
    description: str

    model_config = {"from_attributes": True}


class UserRead(BaseModel):
    id: int
    email: str
    display_name: str
    role_id: int
    role_name: str

    model_config = {"from_attributes": True}


class AuthTokenResponse(BaseModel):
    token: str
    user: UserRead


class CategoryBase(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    slug: str = Field(min_length=2, max_length=80)


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(CategoryBase):
    pass


class CategoryRead(CategoryBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class ComponentBase(BaseModel):
    category_id: int
    name: str = Field(min_length=2, max_length=120)
    brand: str = Field(min_length=2, max_length=80)
    socket_or_standard: str = Field(min_length=2, max_length=80)
    price_huf: int = Field(ge=0)
    watt_usage: int = Field(ge=0)
    stock_status: str = Field(min_length=3, max_length=30)


class ComponentCreate(ComponentBase):
    pass


class ComponentUpdate(ComponentBase):
    pass


class ComponentRead(ComponentBase):
    id: int
    category_name: str
    created_at: datetime


class ConfigurationItemInput(BaseModel):
    component_id: int
    quantity: int = Field(ge=1, le=16)
    note: str | None = None


class ConfigurationBase(BaseModel):
    user_id: int
    name: str = Field(min_length=2, max_length=120)
    goal: str = Field(min_length=2, max_length=160)
    is_public: bool = False
    items: list[ConfigurationItemInput] = Field(default_factory=list)


class ConfigurationCreate(ConfigurationBase):
    pass


class ConfigurationUpdate(ConfigurationBase):
    pass


class ConfigurationItemRead(BaseModel):
    id: int
    component_id: int
    component_name: str
    component_category_name: str | None = None
    component_price_huf: int | None = None
    component_watt_usage: int | None = None
    quantity: int
    note: str | None


class ConfigurationRead(BaseModel):
    id: int
    user_id: int
    user_name: str
    name: str
    goal: str
    total_price_huf: int
    is_public: bool
    created_at: datetime
    updated_at: datetime
    items: list[ConfigurationItemRead]


class ComparisonItemRead(BaseModel):
    id: int
    configuration_id: int
    configuration_name: str
    rank_order: int


class ComparisonRead(BaseModel):
    id: int
    user_id: int
    title: str
    created_at: datetime
    items: list[ComparisonItemRead]


class ComparisonCreateRequest(BaseModel):
    title: str = Field(min_length=2, max_length=120)
    configuration_ids: list[int] = Field(min_length=2)


class StatsRead(BaseModel):
    categories: int
    components: int
    configurations: int
    comparisons: int


class MessageResponse(BaseModel):
    message: str
