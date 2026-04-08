# AI Prompt Naplo - RigCraft

## 2026-03-23 - Stack valasztas az 1. merfoldkohoz

### Prompt

"Valassz egyszeru, gyorsan fejlesztheto keretrendszert a PC konfigurator projekthez. Elony, ha kesobb Python + PostgreSQL backendhez jol illesztheto."

### AI valasz lenyege

- React + Vite frontend
- Kesoobbi backendhez FastAPI + PostgreSQL
- React Router az oldalakhoz, komponens alapu felosztas

### Ertekeles

- Elfogadva: igen
- Modositva: reszben (a kezdo tervekhez hozzaadtam kulon admin oldalt mar az 1. merfoldkohuz)
- Miert: egyszeru startup, gyors fejlesztes, a kovetkezo merfoldkoben jol bovitheto.

## 2026-03-23 - Dokumentacios struktura

### Prompt

"Keszitsd el az 1. merfoldko dokumentaciojat ugy, hogy a pontozasi tablazat minden eleme benne legyen."

### AI valasz lenyege

- SPECIFICATION: projekt leiras, kovetelmenyek, szerepkorok, sitemap
- DATAMODEL: 8 entitas mezokkel, relaciokkal
- COMPONENTS: komponensfa es oldal-komponens mapping

### Ertekeles

- Elfogadva: igen
- Modositva: igen
- Miert: a szerepkorok leirasat pontositottam (visitor/member/admin), hogy jobban igazodjon a temahoz.

## 2026-03-23 - AI korlat es kezeles

### Problema

Az AI egy korabbi peldaban egy masik tema (recept app) tartalmat javasolta, ami nem passzolt a sajat projekttemamhoz.

### Kezeles

- A temahoz nem illo reszeket teljesen lecsereltem.
- Uj promptban egyertelmuen megadtam a sajat projekt cimet es a kotelezo merfoldko elemeket.
- Az AI outputot csak szerkesztes utan hasznaltam, nem vettem at valtoztatas nelkul.

## 2026-04-07 - Merfoldko 2 backend es adatintegracio

### Prompt

"Keszitsd el a 2. merfoldkot FastAPI + relacios adatmodell + frontend backend integracioval, legalabb ket entitason teljes CRUD-dal. Legyen fallback lehetoseg sqlite-al, hogy menjen postgres nelkul is."

### AI valasz lenyege

- FastAPI backend SQLAlchemy modellekkel es seed adattal
- CRUD endpointok kategoriakra, alkatreszekre es konfiguraciokra
- Frontend service reteg + context/reducer allapotkezeles
- Loading/error/empty/toast/debounce/URL-sync megoldasok
- sqlite fallback

### Ertekeles

- Elfogadva: igen, de ellenorzessel
- Modositva: igen
- Miert: a futtatasi lepeseket reszletesebbre bovitettuk, es a dokumentaciot a tenyleges kodhoz igazitottuk.

## 2026-04-07 - AI korlat es javitas

### Problema

Az adatmodell dokumentacio kezdetben UUID tipust tartalmazott, mikozben a tenyleges implementacio integer azonositoikat hasznal.

### Kezeles

- Az adatmodell dokumentaciot frissitettem integer ID-kre.
- Hozzaadtam megvalositasi megjegyzest a SQLite fejlesztesi fallback + PostgreSQL deploy modellrol.
