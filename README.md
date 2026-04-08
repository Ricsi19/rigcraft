[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Ew36zBjj)
# Webfejlesztési keretrendszerek — Projektmunka

> **Hallgato neve:** _Szabo Richard Istvan_  
> **Neptun kod:** _ZVMYME_  
> **Projekt tema:** Szamitogep konfiguracio osszeallito es osszehasonlito oldal  
> **Keretrendszer:** React + Vite (frontend), FastAPI + PostgreSQL (backend) 

---

## 🚀 A projekt indítása (lokális futtatás)

## 0) Elokeszuletek

### Szukseges verzio

- Node.js 20+
- npm 10+
- Python 3.11+

Verziok ellenorzese:

```bash
node -v
npm -v
python --version
```

Ha a python parancs nem mukodik Windows alatt, probald:

```bash
py --version
```

## 1) Projekt klonozasa

```bash
git clone <repo-url>
cd <projekt-mappa>
```

## 2) Frontend dependency telepites

```bash
npm install
```

## 3) Backend virtualis kornyezet es csomagok

Windows PowerShell:

```bash
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
cd ..
```

Ha execution policy hiba van:

```bash
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Linux:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
cd ..
```

## 4) Adatbazis beallitas

Gyors lokalis inditas (ajanlott fejleszteshez):

- A backend/.env fajlban maradhat ez:

```bash
DATABASE_URL=sqlite:///./app.db
```

PostgreSQL hasznalat (ajanlott deployhoz):

```bash
DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/rigcraft
```

Megjegyzes:

- Az API startupkor automatikusan letrehozza a tablakat.
- Seed adatok automatikusan bekerulnek az elso inditaskor.

## 5) Backend inditasa

Kulon terminalban, projekt gyokerbol:

```bash
npm run api:dev
```

API ellenorzes bongeszobol:

- http://localhost:8000/health
- http://localhost:8000/docs

## 6) Frontend API URL beallitasa

Projekt gyokerben hozz letre .env fajlt:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

Ha a backend mashol fut, ezt az URL-t allitsd at.

## 7) Frontend inditasa

Masik terminalban:

```bash
npm run dev
```

Vite altalaban ezt adja:

- http://localhost:5173

## 8) Mukodes ellenorzese (manualis smoke test)

1. Nyisd meg a kezdooldalt es ellenorizd, hogy statisztikak betoltodnek.
2. Menj az Alkatresz katalogus oldalra:

- kereses mukodik,
- szures mukodik,
- rendezes mukodik,
- URL query parameterek valtoznak.

3. Valts admin modra felul a kapcsoloval.
4. Admin oldalon:

- hozz letre uj kategoriat,
- szerkeszd,
- torold megerositessel,
- hozz letre uj alkatreszt,
- szerkeszd,
- torold megerositessel.

5. Builder oldalon:

- hozz letre konfiguraciot,
- szerkeszd a mar letrehozottat,
- torold megerositessel,
- ellenorizd a szamitott osszar valtozasat.

6. Compare oldalon ellenorizd, hogy backendrol jonnek adatok.

## 9) Build ellenorzes

```bash
npm run build
```

Opcionalis backend syntax check:

```bash
python -m py_compile backend\main.py backend\models.py backend\schemas.py backend\database.py
```

## 10) Gyakori hibak es megoldasok

### npm vagy node nem talalhato

- Telepits Node.js LTS verziot.
- Nyiss uj terminalt telepites utan.

### Python package import hibak (fastapi/sqlalchemy)

- Aktiv-e a virtualis kornyezet?
- Futtasd ujra: pip install -r backend/requirements.txt

### CORS vagy halozati hiba frontendben

- Fut-e a backend a 8000-es porton?
- Jo-e a VITE_API_BASE_URL a frontend .env-ben?

### SQLite lock vagy serult lokal DB

- Allitsd le a backendet.
- Torold a backend/app.db fajlt.
- Inditsd ujra az API-t (ujra seedeli az adatokat).

---

## 🌐 Publikus URL

> _[Ird ide a deployolt alkalmazas URL-jet, pl. https://my-app.web.app]_

---

## 📁 Projekt struktúra

```
├── docs/                    # Dokumentáció
│   ├── SPECIFICATION.md     # Funkcionális és nem-funkcionális követelmények
│   ├── DATAMODEL.md         # Adatmodell (entitások, kapcsolatok)
│   ├── COMPONENTS.md        # Komponens-terv
│   └── AI_PROMPT_LOG.md     # AI prompt napló
├── backend/                 # FastAPI backend, relacios adatmodell, CRUD endpointok
├── src/                     # Frontend forraskod (service/store/page komponensek)
└── .github/workflows/       # Automatikus értékelés (ne módosítsd!)
```

---

## 📅 Mérföldkövek

| # | Tartalom | Határidő | Állapot |
|---|----------|----------|---------|
| 1 | Specifikáció, UI és megjelenés | 2026.03.29. 23:59 | ✅ |
| 2 | Backend és adatok | 2026.04.26. 23:59 | ✅ |
| 3 | Biztonság és tesztelés | 2026.05.10. 23:59 | ⬜ |

## Milestone 2 teljesites roviden

- 5+ entitas relaciokkal (Role, User, Category, Component, Configuration, ConfigurationItem, Comparison, ComparisonItem)
- Teljes CRUD 2 entitason: Category es Component (Admin oldalon), plusz Configuration CRUD (Builder oldalon)
- Backend integracio service reteggel (src/services)
- Kozponti state kezeles context + reducer megkozelitessel
- Aszinkron allapotok: loading, hiba, empty state, toast visszajelzes, debounce kereses
- URL-szinkronizalt katalogus szurok (query param)

## API endpoint rovid lista

- GET /health
- GET /stats
- GET /roles
- GET /users
- GET, POST, PUT, DELETE /categories
- GET, POST, PUT, DELETE /components
- GET, POST, PUT, DELETE /configurations
- GET /comparisons

## Egyszeru hosting terv (kesobbre)

- Frontend: Vercel
- Backend: Render Web Service (FastAPI)
- Postgres: Render Postgres vagy Supabase Postgres
- Kornyezeti valtozo: `VITE_API_BASE_URL=<hostolt-backend-url>`

### Hogyan kérd az értékelést?

1. Commitold és push-old a munkádat a `main` vagy `master` branch-re
2. Menj a repód **Actions** fülére
3. Válaszd a **"Mérföldkő értékelés"** workflow-t
4. Kattints a **"Run workflow"** → válaszd ki a mérföldkövet → **"Run workflow"**
5. Az eredmény egy **GitHub Issue**-ban jelenik meg

> ⚠️ Mérföldkőnként **maximum 2 alkalommal** futtathatod az értékelést. Használd bölcsen!  
> ⚠️ A határidőkön automatikus értékelés is fut.

---

## ⚠️ Fontos

- A `.github/workflows/` könyvtár tartalmát **ne módosítsd**!
- A `docs/` mappába rakd a dokumentációs fájlokat.
- Az `AI_PROMPT_LOG.md` fájlt a `docs/` mappában vezesd.