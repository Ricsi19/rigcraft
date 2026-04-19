import { useEffect, useState } from "react";
import ComparisonTable from "../components/ComparisonTable";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/feedback/ErrorState";
import LoadingState from "../components/feedback/LoadingState";
import PageHeader from "../components/PageHeader";
import { comparisonService } from "../services/comparisonService";
import { configurationService } from "../services/configurationService";

export default function ComparePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [comparisons, setComparisons] = useState([]);
  const [configurations, setConfigurations] = useState([]);
  const [title, setTitle] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function retryCompareLoad() {
    window.location.reload();
  }

  function toggleConfig(id) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]
    );
  }

  async function loadPageData() {
    const [comparisonData, configData] = await Promise.all([
      comparisonService.list(),
      configurationService.list()
    ]);
    setComparisons(comparisonData);
    setConfigurations(configData);
  }

  async function handleCreateComparison(event) {
    event.preventDefault();
    setFormError("");

    if (title.trim().length < 2) {
      setFormError("Adj meg egy címet (legalább 2 karakter). ");
      return;
    }
    if (selectedIds.length < 2) {
      setFormError("Válassz ki legalább 2 konfigurációt.");
      return;
    }

    setIsSubmitting(true);
    try {
      await comparisonService.create({
        title: title.trim(),
        configuration_ids: selectedIds
      });
      setTitle("");
      setSelectedIds([]);
      await loadPageData();
    } catch (err) {
      setFormError(err.message || "Az összehasonlítás mentése sikertelen.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const configurationById = new Map(configurations.map((config) => [config.id, config]));

  useEffect(() => {
    let isMounted = true;
    async function loadComparisons() {
      setIsLoading(true);
      setError("");
      try {
        const [comparisonData, configData] = await Promise.all([
          comparisonService.list(),
          configurationService.list()
        ]);
        if (!isMounted) {
          return;
        }
        setComparisons(comparisonData);
        setConfigurations(configData);
      } catch (err) {
        if (!isMounted) {
          return;
        }
        setError(err.message || "Az összehasonlítások betöltése sikertelen.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadComparisons();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <PageHeader
        title="Konfiguráció összehasonlítás"
        subtitle="Válassz ki legalább két konfigurációt, mentsd el, és nézd meg egymás mellett őket."
      />

      <section className="card stack" aria-labelledby="create-comparison-heading">
        <h3 id="create-comparison-heading">Új összehasonlítás</h3>
        <form className="stack" onSubmit={handleCreateComparison}>
          <label>
            <span>Cím</span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Pl. Játékos gépek"
              required
            />
          </label>

          {configurations.length > 0 ? (
            <div className="stack" role="group" aria-label="Választható konfigurációk">
              {configurations.map((config) => (
                <label key={config.id} className="inline-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(config.id)}
                    onChange={() => toggleConfig(config.id)}
                  />
                  <span>
                    {config.name} ({config.total_price_huf.toLocaleString("hu-HU")} Ft)
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <p className="muted">Még nincs összehasonlítható konfiguráció.</p>
          )}

          {formError ? <p className="field-error">{formError}</p> : null}

          <div className="row gap-sm wrap">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting || configurations.length < 2}>
              {isSubmitting ? "Mentés..." : "Összehasonlítás mentése"}
            </button>
          </div>
        </form>
      </section>

      {isLoading ? <LoadingState text="Összehasonlítások betöltése..." /> : null}
      {!isLoading && error ? <ErrorState message={error} onRetry={retryCompareLoad} /> : null}
      {!isLoading && !error && comparisons.length === 0 ? (
        <EmptyState
          title="Nincs összehasonlítás"
          text="Hozz létre konfigurációkat, majd mentsd el az összevetést."
          actionLabel="Oldal frissítése"
          onAction={retryCompareLoad}
        />
      ) : null}

      {!isLoading && !error && comparisons.length > 0 ? (
        <section className="stack" aria-label="Mentett összehasonlítások">
          {comparisons.map((comparison) => (
            <article className="card" key={comparison.id}>
              <h3>{comparison.title}</h3>
              <ComparisonTable
                configurations={comparison.items
                  .map((item) => configurationById.get(item.configuration_id))
                  .filter(Boolean)}
              />
            </article>
          ))}
        </section>
      ) : null}
    </>
  );
}