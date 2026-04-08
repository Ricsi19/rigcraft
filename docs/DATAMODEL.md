# Adatmodell - RigCraft

## 1. Entitasok

### 1. User

- id: integer
- email: string (unique)
- password_hash: string
- display_name: string
- role_id: integer
- created_at: datetime

### 2. Role

- id: integer
- name: enum (visitor, member, admin)
- description: string

### 3. Category

- id: integer
- name: string
- slug: string (unique)
- created_at: datetime

### 4. Component

- id: integer
- category_id: integer
- name: string
- brand: string
- socket_or_standard: string
- price_huf: integer
- watt_usage: integer
- stock_status: enum (in_stock, low_stock, out_of_stock)
- created_at: datetime

### 5. Configuration

- id: integer
- user_id: integer
- name: string
- goal: string
- total_price_huf: integer
- is_public: boolean
- created_at: datetime
- updated_at: datetime

### 6. ConfigurationItem

- id: integer
- configuration_id: integer
- component_id: integer
- quantity: integer
- note: string (nullable)

### 7. Comparison

- id: integer
- user_id: integer
- title: string
- created_at: datetime

### 8. ComparisonItem

- id: integer
- comparison_id: integer
- configuration_id: integer
- rank_order: integer

## 2. Kapcsolatok

- Role 1:N User
	Egy szerepkorhoz tobb felhasznalo tartozhat, egy felhasznalonak pontosan egy szerepkore van.

- Category 1:N Component
	Egy kategoriaban tobb komponens lehet, egy komponens pontosan egy kategoriaba tartozik.

- User 1:N Configuration
	Egy felhasznalo tobb konfiguraciot hozhat letre, egy konfiguracio egy felhasznalohoz tartozik.

- Configuration 1:N ConfigurationItem
	Egy konfiguracio tobb tetelbol all.

- Component 1:N ConfigurationItem
	Egy komponens tobb konfiguracioban is szerepelhet.

- User 1:N Comparison
	Egy felhasznalo tobb osszehasonlitast menthet.

- Comparison 1:N ComparisonItem
	Egy osszehasonlitas legalabb 2 konfiguraciot tartalmaz.

- Configuration 1:N ComparisonItem
	Egy konfiguracio tobb osszehasonlitasban is szerepelhet.

## 3. Relacios osszefoglalo

- N:M kapcsolat 1: Configuration es Component kapcsolata a ConfigurationItem kapcsolotablaval valosul meg.
- N:M kapcsolat 2: Comparison es Configuration kapcsolata a ComparisonItem kapcsolotablaval valosul meg.

Ez a modell tamogatja a teljes CRUD funkciokat, a szerepkor alapu mukodest es a kereses/szures/rendezes kovetelmenyeit.

## 4. Megvalositasi megjegyzes

- Az alkalmazas SQLAlchemy ORM modellekkel kezeli a relacios adatokat.
- Lokalis fejleszteshez SQLite fallback van beallitva (backend/.env).
- Deployhoz PostgreSQL kapcsolat hasznalhato ugyanazzal a modellel.
