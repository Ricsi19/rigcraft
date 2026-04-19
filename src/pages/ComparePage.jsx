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
        subtitle="Nézd meg egymás mellett az összeállítások árát és főbb jellemzőit."
      />

      {isLoading ? <LoadingState text="Összehasonlítások betöltése..." /> : null}
      {!isLoading && error ? <ErrorState message={error} /> : null}
      {!isLoading && !error && comparisons.length === 0 ? (
        <EmptyState title="Nincs összehasonlítás" text="Hozz létre konfigurációkat, majd mentsd el az összevetést." />
      ) : null}

      {!isLoading && !error && comparisons.length > 0 ? (
        <section className="stack" aria-label="Mentett összehasonlítások">
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