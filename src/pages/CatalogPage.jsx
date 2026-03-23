import { useMemo, useState } from "react";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import { catalogItems } from "../data/mockData";

export default function CatalogPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("price-asc");

  const filtered = useMemo(() => {
    let result = [...catalogItems];

    if (query.trim()) {
      const searchValue = query.trim().toLowerCase();
      result = result.filter((item) => item.name.toLowerCase().includes(searchValue));
    }

    if (category !== "all") {
      result = result.filter((item) => item.category === category);
    }

    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [query, category, sortBy]);

  return (
    <>
      <PageHeader
        title="Alkatresz katalogus"
        subtitle="Kereses, szures es rendezes egy helyen - alapja a kesobbi teljes CRUD modulnak."
      />

      <section className="card filter-panel" aria-labelledby="catalog-filter-heading">
        <h3 id="catalog-filter-heading">Szurok</h3>
        <div className="filter-grid">
          <label>
            <span>Kereses</span>
            <input
              type="search"
              placeholder="Pl. RTX, Ryzen"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>

          <label>
            <span>Kategoria</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">Osszes</option>
              <option value="CPU">CPU</option>
              <option value="GPU">GPU</option>
              <option value="RAM">RAM</option>
              <option value="Storage">Storage</option>
              <option value="Motherboard">Motherboard</option>
            </select>
          </label>

          <label>
            <span>Rendezes</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="price-asc">Ar szerint novekvo</option>
              <option value="price-desc">Ar szerint csokkeno</option>
            </select>
          </label>
        </div>
      </section>

      {filtered.length === 0 ? (
        <EmptyState title="Nincs talalat" text="Probalj masik keresesi kifejezest vagy kategoriat." />
      ) : (
        <section className="card-grid" aria-label="Talalati lista">
          {filtered.map((item) => (
            <article key={item.id} className="card component-card">
              <h3>{item.name}</h3>
              <p className="muted">{item.brand}</p>
              <p>{item.category}</p>
              <p className="price-tag">{item.price.toLocaleString("hu-HU")} Ft</p>
              <button type="button" className="btn btn-secondary">
                Hozzaadas
              </button>
            </article>
          ))}
        </section>
      )}
    </>
  );
}