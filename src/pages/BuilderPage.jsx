import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/feedback/ErrorState";
import LoadingState from "../components/feedback/LoadingState";
import PageHeader from "../components/PageHeader";
import { componentService } from "../services/componentService";
import { configurationService } from "../services/configurationService";
import { useAppData } from "../store/AppDataContext";

const emptyForm = {
  id: null,
  user_id: null,
  name: "",
  goal: "",
  is_public: false,
  items: [{ component_id: "", quantity: 1, note: "" }]
};

export default function BuilderPage() {
  const { state, dispatch } = useAppData();
  const { user } = useAuth();
  const isAdmin = user?.role_name === "admin";
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  function resetForm() {
    setForm({ ...emptyForm, user_id: user?.id || null });
    setFormError("");
  }

  function retryBuilderLoad() {
    window.location.reload();
  }

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      setError("");
      try {
        const [components, configurations] = await Promise.all([
          componentService.list({ sortBy: "name_asc" }),
          configurationService.list()
        ]);

        if (!isMounted) {
          return;
        }
        dispatch({ type: "SET_COMPONENTS", payload: components });
        dispatch({ type: "SET_CONFIGURATIONS", payload: configurations });
      } catch (err) {
        if (!isMounted) {
          return;
        }
        setError(err.message || "A konfigurációk betöltése sikertelen.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  const componentMap = useMemo(() => {
    return new Map(state.components.map((item) => [item.id, item]));
  }, [state.components]);

  useEffect(() => {
    if (!user) {
      return;
    }
    setForm((prev) => ({ ...prev, user_id: user.id }));
  }, [user]);

  const derivedTotal = useMemo(() => {
    return form.items.reduce((sum, item) => {
      const selected = componentMap.get(Number(item.component_id));
      if (!selected) {
        return sum;
      }
      return sum + selected.price_huf * Number(item.quantity || 0);
    }, 0);
  }, [form.items, componentMap]);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function updateItem(index, field, value) {
    setForm((prev) => {
      const nextItems = [...prev.items];
      nextItems[index] = {
        ...nextItems[index],
        [field]: value
      };
      return { ...prev, items: nextItems };
    });
  }

  function addItemRow() {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { component_id: "", quantity: 1, note: "" }]
    }));
  }

  function removeItemRow(index) {
    setForm((prev) => {
      if (prev.items.length === 1) {
        return prev;
      }
      return {
        ...prev,
        items: prev.items.filter((_, itemIndex) => itemIndex !== index)
      };
    });
  }

  function validate() {
    if (form.name.trim().length < 2) {
      return "A konfiguráció neve legalább 2 karakter legyen.";
    }
    if (form.goal.trim().length < 2) {
      return "A konfiguráció célja kötelező.";
    }
    if (!form.user_id) {
      return "Bejelentkezett felhasználó hiányzik.";
    }
    if (form.items.length === 0) {
      return "Legalább 1 tétel kötelező.";
    }
    for (const item of form.items) {
      if (!item.component_id) {
        return "Minden sorban válassz komponenst.";
      }
      if (Number(item.quantity) < 1) {
        return "A mennyiség legalább 1 legyen.";
      }
    }
    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationError = validate();
    setFormError(validationError);
    if (validationError) {
      return;
    }

    const payload = {
      user_id: Number(form.user_id),
      name: form.name.trim(),
      goal: form.goal.trim(),
      is_public: form.is_public,
      items: form.items.map((item) => ({
        component_id: Number(item.component_id),
        quantity: Number(item.quantity),
        note: item.note?.trim() || null
      }))
    };

    try {
      if (form.id) {
        await configurationService.update(form.id, payload);
        dispatch({
          type: "SET_TOAST",
          payload: { type: "success", message: "Konfiguráció frissítve." }
        });
      } else {
        await configurationService.create(payload);
        dispatch({
          type: "SET_TOAST",
          payload: { type: "success", message: "Konfiguráció létrehozva." }
        });
      }

      const list = await configurationService.list();
      dispatch({ type: "SET_CONFIGURATIONS", payload: list });
      resetForm();
    } catch (err) {
      setFormError(err.message || "A mentés sikertelen.");
      dispatch({ type: "SET_TOAST", payload: { type: "error", message: "A mentés sikertelen." } });
    }
  }

  function handleEdit(configuration) {
    const canManage = isAdmin || configuration.user_id === user?.id;
    if (!canManage) {
      dispatch({
        type: "SET_TOAST",
        payload: { type: "error", message: "Ezt a konfigurációt nem szerkesztheted." }
      });
      return;
    }

    setForm({
      id: configuration.id,
      user_id: configuration.user_id,
      name: configuration.name,
      goal: configuration.goal,
      is_public: configuration.is_public,
      items:
        configuration.items.length > 0
          ? configuration.items.map((item) => ({
              component_id: String(item.component_id),
              quantity: item.quantity,
              note: item.note || ""
            }))
          : [{ component_id: "", quantity: 1, note: "" }]
    });
    setFormError("");
  }

  async function handleDelete(id) {
    const target = state.configurations.find((config) => config.id === id);
    const canManage = isAdmin || target?.user_id === user?.id;
    if (!canManage) {
      dispatch({
        type: "SET_TOAST",
        payload: { type: "error", message: "Ezt a konfigurációt nem törölheted." }
      });
      return;
    }

    const confirmed = window.confirm("Biztosan törlöd ezt a konfigurációt?");
    if (!confirmed) {
      return;
    }
    try {
      await configurationService.remove(id);
      const list = await configurationService.list();
      dispatch({ type: "SET_CONFIGURATIONS", payload: list });
      dispatch({ type: "SET_TOAST", payload: { type: "success", message: "Konfiguráció törölve." } });
      if (form.id === id) {
        resetForm();
      }
    } catch (err) {
      dispatch({ type: "SET_TOAST", payload: { type: "error", message: err.message || "Törlési hiba." } });
    }
  }

  return (
    <>
      <PageHeader
        title="Konfigurátor"
        subtitle="Állítsd össze a saját gépedet, és mentsd el a konfigurációidat későbbre."
      />

      <section className="card" aria-labelledby="builder-form-heading">
        <h3 id="builder-form-heading">Konfiguráció szerkesztése</h3>
        <form className="stack" onSubmit={handleSubmit}>
          <div className="filter-grid">
            <label>
              <span>Konfiguráció neve</span>
              <input
                type="text"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                required
              />
            </label>
            <label>
              <span>Cél</span>
              <input
                type="text"
                value={form.goal}
                onChange={(event) => updateField("goal", event.target.value)}
                required
              />
            </label>
            <label>
              <span>Tulajdonos</span>
              <input type="text" value={user?.display_name || "-"} disabled readOnly />
            </label>
          </div>

          <label className="inline-checkbox">
            <input
              type="checkbox"
              checked={form.is_public}
              onChange={(event) => updateField("is_public", event.target.checked)}
            />
            <span>Nyilvános konfiguráció</span>
          </label>

          <div className="stack">
            <p className="muted">Tételek</p>
            {form.items.map((item, index) => (
              <div className="line-item-row" key={`config-item-${index}`}>
                <select
                  value={item.component_id}
                  onChange={(event) => updateItem(index, "component_id", event.target.value)}
                  required
                >
                  <option value="">Válassz komponenst</option>
                  {state.components.map((component) => (
                    <option key={component.id} value={component.id}>
                      {component.name} - {component.price_huf.toLocaleString("hu-HU")} Ft
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(event) => updateItem(index, "quantity", event.target.value)}
                />
                <input
                  type="text"
                  placeholder="Megjegyzés"
                  value={item.note}
                  onChange={(event) => updateItem(index, "note", event.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => removeItemRow(index)}
                  aria-label="Tétel törlése"
                >
                  Töröl
                </button>
              </div>
            ))}
          </div>

          <div className="row gap-sm wrap">
            <button type="button" className="btn btn-secondary" onClick={addItemRow}>
              Új tétel
            </button>
            <button type="submit" className="btn btn-primary">
              {form.id ? "Frissítés" : "Létrehozás"}
            </button>
            {form.id ? (
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Mégse
              </button>
            ) : null}
          </div>

          <p className="price-tag">Számított összár: {derivedTotal.toLocaleString("hu-HU")} Ft</p>
          {formError ? <p className="field-error">{formError}</p> : null}
        </form>
      </section>

      <section aria-labelledby="saved-configs-heading">
        <h3 id="saved-configs-heading">Elmentett konfigurációk</h3>
        {isLoading ? <LoadingState text="Konfigurációk betöltése..." /> : null}
        {!isLoading && error ? <ErrorState message={error} onRetry={retryBuilderLoad} /> : null}
        {!isLoading && !error && state.configurations.length === 0 ? (
          <EmptyState title="Nincs konfiguráció" text="Készítsd el az első konfigurációdat a fenti űrlappal." />
        ) : null}
        {!isLoading && !error && state.configurations.length > 0 ? (
          <div className="card-grid" aria-label="Mentett konfigurációk listája">
            {state.configurations.map((config) => (
              <article key={config.id} className="card config-card">
                <h3>{config.name}</h3>
                <p className="muted">Cél: {config.goal}</p>
                <p className="muted">Tulajdonos: {config.user_name}</p>
                <p className="muted">Láthatóság: {config.is_public ? "Nyilvános" : "Privát"}</p>
                <ul className="spec-list">
                  {config.items.map((item) => (
                    <li key={item.id}>
                      {item.component_name} x{item.quantity}
                    </li>
                  ))}
                </ul>
                <p className="price-tag">{config.total_price_huf.toLocaleString("hu-HU")} Ft</p>
                <div className="row gap-sm wrap">
                  {isAdmin || config.user_id === user?.id ? (
                    <>
                      <button type="button" className="btn btn-primary" onClick={() => handleEdit(config)}>
                        Szerkesztés
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={() => handleDelete(config.id)}>
                        Törlés
                      </button>
                    </>
                  ) : (
                    <p className="muted">Csak megtekinthető konfiguráció</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </>
  );
}