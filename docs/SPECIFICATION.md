# RigCraft - Szamitogep konfiguracio osszeallito es osszehasonlito

## 1. Projekt leiras

A RigCraft egy webalkalmazas, amely segit egyedi PC konfiguraciok osszeallitasaban es tobb gep osszehasonlitasaban. A celkozonseg olyan felhasznalok, akik szeretnenek atlathato modon komponenseket valasztani, koltseget tervezni, majd teljesitmeny es ar alapjan donteni.

A projekt hangsulya a minosegi frontend megvalositason van: reszponziv felulet, konzisztens design token rendszer, akadalymentes alapok, komponens alapu architektura es tiszta navigacio.

## 2. Funkcionalis kovetelmenyek

### 2.1 Alkatresz katalogus modul

- Komponensek listazasa (CPU, GPU, RAM, tarhely, alaplap).
- Kereses nev alapjan.
- Szures kategoria szerint.
- Rendezes ar szerint.

### 2.2 Konfiguracio kezeles modul

- Uj konfiguracio letrehozasa kivalasztott komponensekbol.
- Meglevo konfiguracio megtekintese, modositasa, torlese.
- Ar osszesites es kompatibilitasi visszajelzes.

### 2.3 Osszehasonlitas modul

- Legalabb 2 konfiguracio kivalasztasa osszehasonlitashoz.
- Osszehasonlito tabla teljesitmeny, ar es fogyasztas adatokkal.
- Elmentett osszehasonlitasok listaja.

### 2.4 Admin modul

- Alkatreszek CRUD kezelese.
- Kategoriak kezelese.
- Kiemelt konfiguraciok karbantartasa.

### 2.5 Profil modul

- Bejelentkezett felhasznalo mentett konfiguracioinak kezelese.
- Kedvencek es korabbi osszehasonlitasok megtekintese.

## 3. Nem-funkcionalis kovetelmenyek

### 3.1 Technologiai dontesek

- Frontend: React + Vite + React Router.
- Backend: FastAPI (Python) REST API.
- Adatbazis: SQLAlchemy relacios modell (lokalisan SQLite, deployhoz PostgreSQL).
- Auth terv: email/jelszo + token alapu autentikacio.

### 3.2 UX es minosegi elvarasok

- Mobile-first layout legalabb 3 breakpointtal (mobil, tablet, desktop).
- Accessibility alapok: szemantikus HTML, billentyuzetes navigacio, focus stilusok, megfelelo kontraszt.
- Egyertelmu loading/error/empty allapotok.
- Komponens alapu felosztas, ujrafelhasznalhato UI elemek.

### 3.3 Teljesitmeny elvarasok

- Route alapu kod-szetvalasztas (lazy loading).
- Kliens oldali listak szurese/rendezese kesleltetes nelkul.
- Tiszta, atlathato allapotkezeles lokalis state es kontextus kombinaciojaval.

## 4. Felhasznaloi szerepkorok

### 4.1 Latogato

- Nyilvanos oldalak bongeszese.
- Katalogus keresese/szurese/rendezese.
- Osszehasonlitasi nezet megtekintese.

### 4.2 Regisztralt felhasznalo

- Sajat konfiguraciok mentese es szerkesztese.
- Osszehasonlitasok elmentese.
- Profil oldali elozmenyek megtekintese.

### 4.3 Adminisztrator

- Alkatresz, kategoria es tartalom adminisztracio.
- Hibas vagy duplikalt elemek kezelese.

## 5. Kepernyo-lista es sitemap

- / - Kezdolap
- /catalog - Alkatresz katalogus
- /builder - Konfigurator
- /compare - Osszehasonlitas
- /admin - Admin felulet
- * - 404 oldal

Navigacios logika:

- A felso navigacio minden oldalon elerheto.
- Az aktiv route vizualisan kiemelt.
- Ismeretlen URL eseten egyedi 404 oldal jelenik meg.

## 6. Merfoldko 2 implementacios allapot

### 6.1 Backend es perzisztencia

- A frontend valodi HTTP hivassal kommunikal a backenddel.
- A backend CRUD endpointokat ad a kategoriakra, alkatreszekre es konfiguraciokra.
- A tablakat a backend startup soran automatikusan letrehozza.
- Seed adatok automatikusan betoltodnek az elso inditaskor.

### 6.2 Allapotkezelesi strategia

- Kozponti allapot: React Context + reducer (kategoriak, alkatreszek, konfiguraciok, toast).
- Reaktiv adatfolyam: API hivast koveto allapotfrissites automatikusan ujrarendereli a feluletet.
- Form allapotkezeles: admin CRUD urlapok es konfiguracio editor kulon state-ekkel.
- Derived state: konfiguracio osszar valos ideju szamitasa a kivalasztott tetelekbol.
- URL-szinkron: katalogus oldalon a kereses/szures/rendezes query parameterekben tarolodik.

### 6.3 Aszinkron es UX kezeles

- Loading allapotok: kulon loader komponensek.
- Hibakezeles: felhasznalobarat hiba allapot komponensek.
- Empty state: ures listakhoz kulon visszajelzes.
- Toast: sikeres/sikertelen muveleti visszajelzes.
- Debounce: katalogus keresomezo 400 ms debounce-al.
