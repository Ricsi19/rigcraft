# Komponens-terv - RigCraft

## 1. Komponensfa

- App
- AppLayout
- AuthProvider
- ProtectedRoute
- SkipLink
- Navbar
- PageHeader
- HomePage
- StatCard
- CatalogPage
- EmptyState
- BuilderPage
- ComparePage
- ComparisonTable
- AdminPage
- LoginPage
- RegisterPage
- NotFoundPage
- LoadingState
- ErrorState
- ToastMessage

## 1.1 State es service reteg

- AppDataProvider (Context + Reducer)
- AuthContext (session state)
- apiClient service
- authService
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

### Bejelentkezes (/login)

- LoginPage
- PageHeader

### Regisztracio (/register)

- RegisterPage
- PageHeader

### 404 oldal (*)

- AppLayout
- NotFoundPage

## 3. Komponens-kommunikacio

- Az AuthProvider kezeli a bejelentkezett user es token allapotat.
- A ProtectedRoute vegzi az auth es role alapu route vedelmet.
- Az AppLayout auth allapottol fuggoen jelenit meg elemeket.
- Az AppDataProvider kozponti allapotot ad a fo adatkollekciokhoz.
- Az oldalak service retegen keresztul kommunikalnak a backenddel.
- A katalogus oldalon a kereses/szures/rendezes URL query parameterekben is tukrozodik.
- A ToastMessage komponens globalis muveleti visszajelzest ad.
