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
- ComparePage
- ComparisonTable
- AdminPage
- NotFoundPage
- LoadingState
- ErrorState
- ToastMessage

## 1.1 State es service reteg

- AppDataProvider (Context + Reducer)
- apiClient service
- categoryService
- componentService
- configurationService
- comparisonService
- statsService
- useDebouncedValue hook

## 2. Oldalak es komponensek osszerendelese

### Kezdolap (/)

- AppLayout
- PageHeader
- StatCard

### Alkatresz katalogus (/catalog)

- AppLayout
- PageHeader
- EmptyState
- LoadingState
- ErrorState

### Konfigurator (/builder)

- AppLayout
- PageHeader
- LoadingState
- ErrorState

### Osszehasonlitas (/compare)

- AppLayout
- PageHeader
- ComparisonTable
- LoadingState
- ErrorState

### Admin (/admin)

- AppLayout
- PageHeader
- EmptyState
- LoadingState
- ErrorState

### 404 oldal (*)

- AppLayout
- NotFoundPage

## 3. Komponens-kommunikacio

- Az App kezeli a globalis interakcios modot (visitor/member/admin).
- Az AppLayout tovabbitja a szerepkort az Outlet contexten keresztul.
- Az AppDataProvider kozponti allapotot ad a fo adatkollekciokhoz.
- Az oldalak service retegen keresztul kommunikalnak a backenddel.
- A katalogus oldalon a kereses/szures/rendezes URL query parameterekben is tukrozodik.
- A ToastMessage komponens globalis muveleti visszajelzest ad.
