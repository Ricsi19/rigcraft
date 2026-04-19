import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/feedback/ErrorState";
import LoadingState from "../components/feedback/LoadingState";
import PageHeader from "../components/PageHeader";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { categoryService } from "../services/categoryService";
import { componentService } from "../services/componentService";
import { useAppData } from "../store/AppDataContext";

export default function CatalogPage() {
  const { state, dispatch } = useAppData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "price_asc");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const debouncedQuery = useDebouncedValue(query, 400);

  useEffect(() => {
    const nextParams = new URLSearchParams();
    if (query) {
      nextParams.set("q", query);
    }
    if (categoryId) {
      nextParams.set("categoryId", categoryId);
    }
    if (sortBy) {
      nextParams.set("sort", sortBy);
    }
    setSearchParams(nextParams, { replace: true });
  }, [query, categoryId, sortBy, setSearchParams]);

  useEffect(() => {
    let isMounted = true;

    async function loadComponents() {
      setIsLoading(true);
      setError("");
      try {
        const list = await componentService.list({
          query: debouncedQuery,
          categoryId,
          sortBy
        });
        if (!isMounted) {
          return;
        }
        dispatch({ type: "SET_COMPONENTS", payload: list });
      } catch (err) {
        if (!isMounted) {
          return;
        }
        setError(err.message || "A katalógus betöltése sikertelen.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadComponents();
    return () => {
      isMounted = false;
    };
  }, [debouncedQuery, categoryId, sortBy, dispatch]);

  useEffect(() => {
    async function loadCategoriesIfNeeded() {
      if (state.categories.length > 0) {
        return;
      }
      try {
        const categories = await categoryService.list();
        dispatch({ type: "SET_CATEGORIES", payload: categories });
      } catch {
        // Non-blocking: category filter can still function with empty list.
      }
    }
    loadCategoriesIfNeeded();
  }, [state.categories.length, dispatch]);

  const components = state.components;

  return (
    <>
      <PageHeader
        title="Alkatrész katalógus"
        subtitle="Keresd meg gyorsan a számodra ideális komponenseket szűréssel és rendezéssel."
      />

      <section className="card filter-panel" aria-labelledby="catalog-filter-heading">
        <h3 id="catalog-filter-heading">Szűrők</h3>
        <div className="filter-grid">
          <label>
            <span>Keresés</span>
            <input
              type="search"
              placeholder="Pl. RTX, Ryzen"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>

          <label>
            <span>Kategória</span>
            <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
              <option value="">Összes</option>
              {state.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Rendezés</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="price_asc">Ár szerint növekvő</option>
              <option value="price_desc">Ár szerint csökkenő</option>
              <option value="name_asc">Név szerint A-Z</option>
            </select>
          </label>
        </div>
      </section>

      {isLoading ? <LoadingState text="Alkatrészek betöltése..." /> : null}
      {!isLoading && error ? <ErrorState message={error} /> : null}

      {!isLoading && !error && components.length === 0 ? (
        <EmptyState title="Nincs találat" text="Próbálj másik keresési kifejezést vagy kategóriát." />
      ) : null}

      {!isLoading && !error && components.length > 0 ? (
        <section className="card-grid" aria-label="Talalati lista">
          {components.map((item) => (
            <article key={item.id} className="card component-card">
              <h3>{item.name}</h3>
              <p className="muted">{item.brand}</p>
              <p>{item.category_name}</p>
              <p className="price-tag">{item.price_huf.toLocaleString("hu-HU")} Ft</p>
              <button type="button" className="btn btn-secondary">
                Hozzáadás
              </button>
            </article>
          ))}
        </section>
      ) : null}
    </>
  );
}