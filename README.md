[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Ew36zBjj)
# Webfejlesztési keretrendszerek — Projektmunka

> **Hallgato neve:** _Szabo Richard Istvan_  
> **Neptun kod:** _ZVMYME_  
> **Projekt tema:** Szamitogep konfiguracio osszeallito es osszehasonlito oldal  
> **Keretrendszer:** React + Vite (frontend), FastAPI + PostgreSQL (tervezett backend) 

---

## 🚀 A projekt indítása (lokális futtatás)

```bash
git clone <repo-url>
cd <projekt-mappa>
npm install
npm run dev
```

Build ellenorzes:

```bash
npm run build
```

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
├── src/                     # Forráskód
└── .github/workflows/       # Automatikus értékelés (ne módosítsd!)
```

---

## 📅 Mérföldkövek

| # | Tartalom | Határidő | Állapot |
|---|----------|----------|---------|
| 1 | Specifikáció, UI és megjelenés | 2026.03.29. 23:59 | ✅ |
| 2 | Backend és adatok | 2026.04.26. 23:59 | ⬜ |
| 3 | Biztonság és tesztelés | 2026.05.10. 23:59 | ⬜ |

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