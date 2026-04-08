from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class Role(Base):
    __tablename__ = "roles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(30), unique=True, index=True)
    description: Mapped[str] = mapped_column(String(120))

    users: Mapped[list["User"]] = relationship(back_populates="role")


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    display_name: Mapped[str] = mapped_column(String(80))
    role_id: Mapped[int] = mapped_column(ForeignKey("roles.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    role: Mapped[Role] = relationship(back_populates="users")
    configurations: Mapped[list["Configuration"]] = relationship(back_populates="user")
    comparisons: Mapped[list["Comparison"]] = relationship(back_populates="user")


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(80), unique=True)
    slug: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    components: Mapped[list["Component"]] = relationship(back_populates="category")


class Component(Base):
    __tablename__ = "components"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"), index=True)
    name: Mapped[str] = mapped_column(String(120), index=True)
    brand: Mapped[str] = mapped_column(String(80))
    socket_or_standard: Mapped[str] = mapped_column(String(80))
    price_huf: Mapped[int] = mapped_column(Integer)
    watt_usage: Mapped[int] = mapped_column(Integer)
    stock_status: Mapped[str] = mapped_column(String(30), default="in_stock")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    category: Mapped[Category] = relationship(back_populates="components")
    configuration_items: Mapped[list["ConfigurationItem"]] = relationship(back_populates="component")


class Configuration(Base):
    __tablename__ = "configurations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    name: Mapped[str] = mapped_column(String(120))
    goal: Mapped[str] = mapped_column(String(160))
    total_price_huf: Mapped[int] = mapped_column(Integer, default=0)
    is_public: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user: Mapped[User] = relationship(back_populates="configurations")
    items: Mapped[list["ConfigurationItem"]] = relationship(
        back_populates="configuration", cascade="all, delete-orphan"
    )
    comparison_items: Mapped[list["ComparisonItem"]] = relationship(back_populates="configuration")


class ConfigurationItem(Base):
    __tablename__ = "configuration_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    configuration_id: Mapped[int] = mapped_column(ForeignKey("configurations.id"), index=True)
    component_id: Mapped[int] = mapped_column(ForeignKey("components.id"), index=True)
    quantity: Mapped[int] = mapped_column(Integer, default=1)
    note: Mapped[str | None] = mapped_column(Text, nullable=True)

    configuration: Mapped[Configuration] = relationship(back_populates="items")
    component: Mapped[Component] = relationship(back_populates="configuration_items")


class Comparison(Base):
    __tablename__ = "comparisons"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    title: Mapped[str] = mapped_column(String(120))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped[User] = relationship(back_populates="comparisons")
    items: Mapped[list["ComparisonItem"]] = relationship(back_populates="comparison", cascade="all, delete-orphan")


class ComparisonItem(Base):
    __tablename__ = "comparison_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    comparison_id: Mapped[int] = mapped_column(ForeignKey("comparisons.id"), index=True)
    configuration_id: Mapped[int] = mapped_column(ForeignKey("configurations.id"), index=True)
    rank_order: Mapped[int] = mapped_column(Integer, default=1)

    comparison: Mapped[Comparison] = relationship(back_populates="items")
    configuration: Mapped[Configuration] = relationship(back_populates="comparison_items")
