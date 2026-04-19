import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/feedback/ErrorState";
import LoadingState from "../components/feedback/LoadingState";
import PageHeader from "../components/PageHeader";
import { categoryService } from "../services/categoryService";
import { componentService } from "../services/componentService";
import { useAppData } from "../store/AppDataContext";

const initialCategoryForm = { id: null, name: "", slug: "" };
const initialComponentForm = {
  id: null,
  category_id: "",
  name: "",
  brand: "",
  socket_or_standard: "",
  price_huf: "",
  watt_usage: "",
  stock_status: "in_stock"
};

export default function AdminPage() {
  const { role } = useOutletContext();
  const { state, dispatch } = useAppData();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryForm, setCategoryForm] = useState(initialCategoryForm);
  const [componentForm, setComponentForm] = useState(initialComponentForm);
  const [categoryError, setCategoryError] = useState("");
  const [componentError, setComponentError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadAdminData() {
      if (role !== "admin") {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError("");
      try {
        const [categories, components] = await Promise.all([
          categoryService.list(),
          componentService.list({ sortBy: "name_asc" })
        ]);
        if (!isMounted) {
          return;
        }
        dispatch({ type: "SET_CATEGORIES", payload: categories });
        dispatch({ type: "SET_COMPONENTS", payload: components });
      } catch (err) {
        if (!isMounted) {
          return;
        }
        setError(err.message || "Az admin adatok betöltése sikertelen.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAdminData();
    return () => {
      isMounted = false;
    };
  }, [role, dispatch]);

  function updateCategoryField(name, value) {
    setCategoryForm((prev) => ({ ...prev, [name]: value }));
  }

  function updateComponentField(name, value) {
    setComponentForm((prev) => ({ ...prev, [name]: value }));
  }

  function validateCategory() {
    if (categoryForm.name.trim().length < 2) {
      return "A kategória neve legalább 2 karakter legyen.";
    }
    if (categoryForm.slug.trim().length < 2) {
      return "A slug legalább 2 karakter legyen.";
    }
    return "";
  }

  function validateComponent() {
    if (!componentForm.category_id) {
      return "A kategória megadása kötelező.";
    }
    if (componentForm.name.trim().length < 2) {
      return "Az alkatrész neve legalább 2 karakter legyen.";
    }
    if (componentForm.brand.trim().length < 2) {
      return "A márka megadása kötelező.";
    }
    if (Number(componentForm.price_huf) < 0 || componentForm.price_huf === "") {
      return "Az ár kötelező, és nem lehet negatív.";
    }
    if (Number(componentForm.watt_usage) < 0 || componentForm.watt_usage === "") {
      return "A fogyasztás kötelező, és nem lehet negatív.";
    }
    return "";
  }

  async function refreshLists() {
    const [categories, components] = await Promise.all([
      categoryService.list(),
      componentService.list({ sortBy: "name_asc" })
    ]);
    dispatch({ type: "SET_CATEGORIES", payload: categories });
    dispatch({ type: "SET_COMPONENTS", payload: components });
  }

  async function submitCategory(event) {
    event.preventDefault();
    const validationError = validateCategory();
    setCategoryError(validationError);
    if (validationError) {
      return;
    }

    const payload = {
      name: categoryForm.name.trim(),
      slug: categoryForm.slug.trim().toLowerCase()
    };

    try {
      if (categoryForm.id) {
        await categoryService.update(categoryForm.id, payload);
        dispatch({ type: "SET_TOAST", payload: { type: "success", message: "Kategória frissítve." } });
      } else {
        await categoryService.create(payload);
        dispatch({ type: "SET_TOAST", payload: { type: "success", message: "Kategória létrehozva." } });
      }
      await refreshLists();
      setCategoryForm(initialCategoryForm);
      setCategoryError("");
    } catch (err) {
      setCategoryError(err.message || "A művelet sikertelen.");
    }
  }

  async function deleteCategory(id) {
    if (!window.confirm("Biztosan törlöd ezt a kategóriát?")) {
      return;
    }
    try {
      await categoryService.remove(id);
      await refreshLists();
      dispatch({ type: "SET_TOAST", payload: { type: "success", message: "Kategória törölve." } });
    } catch (err) {
      dispatch({ type: "SET_TOAST", payload: { type: "error", message: err.message || "Törlési hiba." } });
    }
  }

  async function submitComponent(event) {
    event.preventDefault();
    const validationError = validateComponent();
    setComponentError(validationError);
    if (validationError) {
      return;
    }

    const payload = {
      category_id: Number(componentForm.category_id),
      name: componentForm.name.trim(),
      brand: componentForm.brand.trim(),
      socket_or_standard: componentForm.socket_or_standard.trim(),
      price_huf: Number(componentForm.price_huf),
      watt_usage: Number(componentForm.watt_usage),
      stock_status: componentForm.stock_status
    };

    try {
      if (componentForm.id) {
        await componentService.update(componentForm.id, payload);
        dispatch({ type: "SET_TOAST", payload: { type: "success", message: "Alkatrész frissítve." } });
      } else {
        await componentService.create(payload);
        dispatch({ type: "SET_TOAST", payload: { type: "success", message: "Alkatrész létrehozva." } });
      }
      await refreshLists();
      setComponentForm(initialComponentForm);
      setComponentError("");
    } catch (err) {
      setComponentError(err.message || "A művelet sikertelen.");
    }
  }

  async function deleteComponent(id) {
    if (!window.confirm("Biztosan törlöd ezt az alkatrészt?")) {
      return;
    }
    try {
      await componentService.remove(id);
      await refreshLists();
      dispatch({ type: "SET_TOAST", payload: { type: "success", message: "Alkatrész törölve." } });
    } catch (err) {
      dispatch({ type: "SET_TOAST", payload: { type: "error", message: err.message || "Törlési hiba." } });
    }
  }

  return (
    <>
      <PageHeader
        title="Admin panel"
        subtitle="Kategóriák és alkatrészek kezelése egy helyen."
      />

      {role === "admin" ? (
        <>
          {isLoading ? <LoadingState text="Admin felület betöltése..." /> : null}
          {!isLoading && error ? <ErrorState message={error} /> : null}
          {!isLoading && !error ? (
            <section className="stack" aria-label="Admin kezelőfelület">
              <article className="card">
                <h3>Kategóriák kezelése</h3>
                <form className="stack" onSubmit={submitCategory}>
                  <div className="filter-grid">
                    <label>
                      <span>Név</span>
                      <input
                        type="text"
                        value={categoryForm.name}
                        onChange={(event) => updateCategoryField("name", event.target.value)}
                        required
                      />
                    </label>
                    <label>
                      <span>Slug</span>
                      <input
                        type="text"
                        value={categoryForm.slug}
                        onChange={(event) => updateCategoryField("slug", event.target.value)}
                        required
                      />
                    </label>
                  </div>
                  {categoryError ? <p className="field-error">{categoryError}</p> : null}
                  <div className="row gap-sm wrap">
                    <button type="submit" className="btn btn-primary">
                      {categoryForm.id ? "Frissítés" : "Létrehozás"}
                    </button>
                    {categoryForm.id ? (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setCategoryForm(initialCategoryForm)}
                      >
                        Mégse
                      </button>
                    ) : null}
                  </div>
                </form>

                <div className="stack">
                  {state.categories.map((category) => (
                    <div className="list-row" key={category.id}>
                      <div>
                        <strong>{category.name}</strong>
                        <p className="muted">slug: {category.slug}</p>
                      </div>
                      <div className="row gap-sm wrap">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setCategoryForm({ id: category.id, name: category.name, slug: category.slug })}
                        >
                          Szerkesztés
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => deleteCategory(category.id)}>
                          Törlés
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="card">
                <h3>Alkatrészek kezelése</h3>
                <form className="stack" onSubmit={submitComponent}>
                  <div className="filter-grid">
                    <label>
                      <span>Kategória</span>
                      <select
                        value={componentForm.category_id}
                        onChange={(event) => updateComponentField("category_id", event.target.value)}
                        required
                      >
                        <option value="">Válassz kategóriát</option>
                        {state.categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span>Név</span>
                      <input
                        type="text"
                        value={componentForm.name}
                        onChange={(event) => updateComponentField("name", event.target.value)}
                        required
                      />
                    </label>
                    <label>
                      <span>Márka</span>
                      <input
                        type="text"
                        value={componentForm.brand}
                        onChange={(event) => updateComponentField("brand", event.target.value)}
                        required
                      />
                    </label>
                    <label>
                      <span>Socket/standard</span>
                      <input
                        type="text"
                        value={componentForm.socket_or_standard}
                        onChange={(event) => updateComponentField("socket_or_standard", event.target.value)}
                        required
                      />
                    </label>
                    <label>
                      <span>Ár (HUF)</span>
                      <input
                        type="number"
                        min="0"
                        value={componentForm.price_huf}
                        onChange={(event) => updateComponentField("price_huf", event.target.value)}
                        required
                      />
                    </label>
                    <label>
                      <span>Fogyasztás (W)</span>
                      <input
                        type="number"
                        min="0"
                        value={componentForm.watt_usage}
                        onChange={(event) => updateComponentField("watt_usage", event.target.value)}
                        required
                      />
                    </label>
                    <label>
                      <span>Készlet státusz</span>
                      <select
                        value={componentForm.stock_status}
                        onChange={(event) => updateComponentField("stock_status", event.target.value)}
                        required
                      >
                        <option value="in_stock">in_stock</option>
                        <option value="low_stock">low_stock</option>
                        <option value="out_of_stock">out_of_stock</option>
                      </select>
                    </label>
                  </div>

                  {componentError ? <p className="field-error">{componentError}</p> : null}

                  <div className="row gap-sm wrap">
                    <button type="submit" className="btn btn-primary">
                      {componentForm.id ? "Frissítés" : "Létrehozás"}
                    </button>
                    {componentForm.id ? (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setComponentForm(initialComponentForm)}
                      >
                        Mégse
                      </button>
                    ) : null}
                  </div>
                </form>

                <div className="stack">
                  {state.components.map((component) => (
                    <div className="list-row" key={component.id}>
                      <div>
                        <strong>{component.name}</strong>
                        <p className="muted">
                          {component.category_name} | {component.brand} | {component.price_huf.toLocaleString("hu-HU")} Ft
                        </p>
                      </div>
                      <div className="row gap-sm wrap">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() =>
                            setComponentForm({
                              id: component.id,
                              category_id: String(component.category_id),
                              name: component.name,
                              brand: component.brand,
                              socket_or_standard: component.socket_or_standard,
                              price_huf: String(component.price_huf),
                              watt_usage: String(component.watt_usage),
                              stock_status: component.stock_status
                            })
                          }
                        >
                          Szerkesztés
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => deleteComponent(component.id)}
                        >
                          Torles
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          ) : null}
        </>
      ) : (
        <EmptyState
          title="Nincs jogosultsag"
          text="Valts admin modra a jobb felso kapcsoloval az oldal elereshez."
        />
      )}
    </>
  );
}