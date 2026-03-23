# Adatmodell - RigCraft

## 1. Entitasok

### 1. User

- id: UUID
- email: string (unique)
- password_hash: string
- display_name: string
- role_id: UUID
- created_at: datetime

### 2. Role

- id: UUID
- name: enum (visitor, member, admin)
- description: string

### 3. Category

- id: UUID
- name: string
- slug: string (unique)
- created_at: datetime

### 4. Component

- id: UUID
- category_id: UUID
- name: string
- brand: string
- socket_or_standard: string
- price_huf: integer
- watt_usage: integer
- stock_status: enum (in_stock, low_stock, out_of_stock)
- created_at: datetime

### 5. Configuration

- id: UUID
- user_id: UUID
- name: string
- goal: string
- total_price_huf: integer
- is_public: boolean
- created_at: datetime
- updated_at: datetime

### 6. ConfigurationItem

- id: UUID
- configuration_id: UUID
- component_id: UUID
- quantity: integer
- note: string (nullable)

### 7. Comparison

- id: UUID
- user_id: UUID
- title: string
- created_at: datetime

### 8. ComparisonItem

- id: UUID
- comparison_id: UUID
- configuration_id: UUID
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
