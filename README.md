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
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
copy backend\.env.example backend\.env
```

Ha execution policy hiba van:

```bash
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Linux:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
cp backend/.env.example backend/.env
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
- A seed admin fiok:
	- email: `admin@rigcraft.hu`
	- jelszo: `Admin123!`

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

3. Nyisd meg a Regisztracio oldalt es hozz letre uj fiokot.
4. Jelentkezz ki, majd lepj be ujra (email + jelszo).
5. Frissitsd az oldalt es ellenorizd, hogy bejelentkezve maradsz.
6. Menj az Admin oldalra:

- bejelentkezes nelkul loginra iranyit,
- normal userrel nincs admin hozzaferes,
- admin userrel latod a CRUD feluleteket.

7. Admin oldalon:

- hozz letre uj kategoriat,
- szerkeszd,
- torold megerositessel,
- hozz letre uj alkatreszt,
- szerkeszd,
- torold megerositessel.

8. Builder oldalon:

- hozz letre konfiguraciot,
- szerkeszd a mar letrehozottat,
- torold megerositessel,
- ellenorizd a szamitott osszar valtozasat.

9. Compare oldalon ellenorizd, hogy backendrol jonnek adatok.

## 9) Build ellenorzes

```bash
npm run build
```

Opcionalis backend syntax check:

```bash
python -m py_compile backend\main.py backend\models.py backend\schemas.py backend\database.py
```

## 10) Tesztek futtatasa

Unit tesztek (17 db):

```bash
npm run test:unit
```

E2E teszt (Playwright, 1 db happy path):

```bash
npx playwright install chromium
npm run test:e2e
```

Mit tesztel az E2E:

- regisztracio
- bejelentkezett allapot
- vedett oldal (builder) elerese

## 11) Gyakori hibak es megoldasok

### npm vagy node nem talalhato

- Telepits Node.js LTS verziot.
- Nyiss uj terminalt telepites utan.

### Python package import hibak (fastapi/sqlalchemy)

- Aktiv-e a virtualis kornyezet?
- Futtasd ujra: pip install -r backend/requirements.txt

### `'.venv' is not recognized` hiba `npm run api:dev` eseten

- Ellenorizd, hogy projekt gyokerben letezik `.venv`.
- Ha nincs, futtasd ujra a 3) pont lepeseit.

### E2E teszt indul, de backend timeoutol

- Fusson az API lokalban: `npm run api:dev`
- Probald kulon: `http://127.0.0.1:8000/health`
- Ha nem jo, torold `backend/app.db` es inditsd ujra.

### CORS vagy halozati hiba frontendben

- Fut-e a backend a 8000-es porton?
- Jo-e a VITE_API_BASE_URL a frontend .env-ben?

### SQLite lock vagy serult lokal DB

- Allitsd le a backendet.
- Torold a backend/app.db fajlt.
- Inditsd ujra az API-t (ujra seedeli az adatokat).

---

## ☁️ Deploy (nagyon reszletes, ingyenes opcio)

Ez a legstabilabb ingyenes kombinalt utvonal:

- Backend: Render Web Service (free)
- Database: Neon PostgreSQL (free)
- Frontend: Vercel (free)

### A) Neon Postgres letrehozas

1. Menj ide: `https://neon.tech`
2. Regisztralj GitHub fiokkal.
3. `Create project`.
4. Valszd ki regio: Europahoz legkozelebbi.
5. Projekt letrehozas utan masold ki a connection stringet.
6. SQLAlchemy kompatibilis formatum kell:

```bash
postgresql+psycopg2://USER:PASSWORD@HOST/DBNAME?sslmode=require
```

### B) Backend deploy Renderre

1. Menj ide: `https://render.com`
2. `New +` -> `Web Service`.
3. Connect GitHub repo.
4. Beallitasok:

- Runtime: `Python 3`
- Build Command:

```bash
pip install -r backend/requirements.txt
```

- Start Command:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT --app-dir backend
```

5. Environment Variables:

- `DATABASE_URL` = Neon connection string (SQLAlchemy format)

6. Deploy utan ellenorizd:

- `https://<render-backend-url>/health`
- `https://<render-backend-url>/docs`

### C) Frontend deploy Vercelre

1. Menj ide: `https://vercel.com`
2. `Add New` -> `Project`
3. Importald ugyanazt a GitHub repot.
4. Framework felismeres: Vite.
5. Build beallitasok (ha kell manualisan):

- Build Command: `npm run build`
- Output Directory: `dist`

6. Environment Variables:

- `VITE_API_BASE_URL` = `https://<render-backend-url>`

7. Deploy.

### D) Deploy utani ellenorzo lista

1. Nyisd meg a frontend publikus URL-t.
2. Regisztracio mukodik.
3. Login mukodik hibakezelessel.
4. Logout mukodik.
5. Frissites utan bent maradsz (auth perzisztencia).
6. `/builder` bejelentkezes nelkul loginra iranyit.
7. Admin oldal normal usernek tiltott, adminnak mukodik.
8. CRUD muveletek valoban mentenek backendre.
9. Unit + E2E tesztek lokalban zolden futnak.

### E) Mi legyen a README-ben beadashoz

- Frontend publikus URL (Vercel)
- Opcion: backend URL kulon sorban
- Pontos lokalis futtatasi lepesek (mar benne vannak)
- Tesztfuttatasi parancsok (mar benne vannak)

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
| 3 | Biztonság és tesztelés | 2026.05.10. 23:59 | ✅* |

## Milestone 2 teljesites roviden

- 5+ entitas relaciokkal (Role, User, Category, Component, Configuration, ConfigurationItem, Comparison, ComparisonItem)
- Teljes CRUD 2 entitason: Category es Component (Admin oldalon), plusz Configuration CRUD (Builder oldalon)
- Backend integracio service reteggel (src/services)
- Kozponti state kezeles context + reducer megkozelitessel
- Aszinkron allapotok: loading, hiba, empty state, toast visszajelzes, debounce kereses
- URL-szinkronizalt katalogus szurok (query param)

## Milestone 3 teljesites roviden

- Mukodo email/jelszo regisztracio, login, logout
- Session token perzisztencia localStorage-ben
- Auth-fuggo UI (nav elemek, szerepkor cimke, kijelentkezes)
- Vedett route-ok (`/builder`, `/compare`, `/admin`)
- Role-based route vedes (`/admin` csak admin)
- Backend oldali jogosultsag ellenorzes (admin CRUD, owner-only config edit/delete)
- Kliens + szerver oldali validacio
- 10+ unit teszt (17)
- 1 E2E teszt (Playwright happy path)

`*` A publikus URL mezot deploy utan toltod fel a vegleges linkkel.

## API endpoint rovid lista

- POST /auth/register
- POST /auth/login
- POST /auth/logout
- GET /auth/me
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