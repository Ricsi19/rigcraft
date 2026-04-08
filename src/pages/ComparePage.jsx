import { useEffect, useState } from "react";
import ComparisonTable from "../components/ComparisonTable";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/feedback/ErrorState";
import LoadingState from "../components/feedback/LoadingState";
import PageHeader from "../components/PageHeader";
import { comparisonService } from "../services/comparisonService";

function toRows(comparison) {
  return comparison.items.map((item) => ({
    label: `#${item.rank_order}`,
    esport: item.configuration_name,
    creator: "-",
    budget: "-"
  }));
}

export default function ComparePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [comparisons, setComparisons] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function loadComparisons() {
      setIsLoading(true);
      setError("");
      try {
        const data = await comparisonService.list();
        if (!isMounted) {
          return;
        }
        setComparisons(data);
      } catch (err) {
        if (!isMounted) {
          return;
        }
        setError(err.message || "Osszehasonlitasok betoltese sikertelen.");
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
        title="Konfiguracio osszehasonlitas"
        subtitle="Teljesitmeny, ar es fogyasztas alapjan hasonlitsd ossze az osszeallitasokat."
      />

      {isLoading ? <LoadingState text="Osszehasonlitasok betoltese..." /> : null}
      {!isLoading && error ? <ErrorState message={error} /> : null}
      {!isLoading && !error && comparisons.length === 0 ? (
        <EmptyState title="Nincs osszehasonlitas" text="Hozz letre konfiguraciokat, majd ments osszehasonlitast." />
      ) : null}

      {!isLoading && !error && comparisons.length > 0 ? (
        <section className="stack" aria-label="Mentett osszehasonlitasok">
          {comparisons.map((comparison) => (
            <article className="card" key={comparison.id}>
              <h3>{comparison.title}</h3>
              <ComparisonTable rows={toRows(comparison)} />
            </article>
          ))}
        </section>
      ) : null}
    </>
  );
}