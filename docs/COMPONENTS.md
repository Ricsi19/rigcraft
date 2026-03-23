# Komponens-terv - RigCraft

## 1. Komponensfa

- App
- AppLayout
- SkipLink
- Navbar
- RoleSwitcher
- PageHeader
- HomePage
- StatCard
- CatalogPage
- EmptyState
- BuilderPage
- ConfigCard
- ComparePage
- ComparisonTable
- AdminPage
- NotFoundPage

## 2. Oldalak es komponensek osszerendelese

### Kezdolap (/)

- AppLayout
- PageHeader
- StatCard

### Alkatresz katalogus (/catalog)

- AppLayout
- PageHeader
- EmptyState

### Konfigurator (/builder)

- AppLayout
- PageHeader
- ConfigCard

### Osszehasonlitas (/compare)

- AppLayout
- PageHeader
- ComparisonTable

### Admin (/admin)

- AppLayout
- PageHeader
- EmptyState

### 404 oldal (*)

- AppLayout
- NotFoundPage

## 3. Komponens-kommunikacio

- Az App kezeli a globalis interakcios modot (visitor/member/admin).
- Az AppLayout tovabbitja a szerepkort az Outlet contexten keresztul.
- Az egyes oldalak sajat lokalis state-et hasznalnak (pl. kereses/szures/rendezes a katalogusban).
- A jelenlegi oldal allapotat a router es a NavLink aktiv allapota adja.
