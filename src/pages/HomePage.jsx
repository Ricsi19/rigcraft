import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ErrorState from "../components/feedback/ErrorState";
import LoadingState from "../components/feedback/LoadingState";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import { statsService } from "../services/statsService";

export default function HomePage() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      setIsLoading(true);
      setError("");
      try {
        const result = await statsService.get();
        if (!isMounted) {
          return;
        }
        setStats(result);
      } catch (err) {
        if (!isMounted) {
          return;
        }
        setError(err.message || "A statisztikak betoltese sikertelen.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const cards = stats
    ? [
        { label: "Elerheto kategoriak", value: stats.categories },
        { label: "Elerheto alkatreszek", value: stats.components },
        { label: "Elmentett konfiguraciok", value: stats.configurations },
        { label: "Aktiv osszehasonlitasok", value: stats.comparisons }
      ]
    : [];

  return (
    <>
      <PageHeader
        title="RigCraft kezdooldal"
        subtitle="Epitsd ossze a gepeidet, hasonlitsd ossze teljesitmeny alapjan, es valassz tudatosan."
      />

      <section className="hero card-grid">
        <article className="card hero-copy">
          <h3>Gyors konfiguracio tervezes</h3>
          <p>
            Az oldal celja, hogy egyszeruen atlathato, jol hasznalhato feluleten valaszthasd ki
            az idealis komponenseket.
          </p>
          <Link className="btn btn-primary" to="/builder">
            Konfigurator megnyitasa
          </Link>
        </article>

        <figure className="card hero-media" aria-label="Szerkesztoi gep kepes illusztracioja">
          <img
            src="https://media.sketchfab.com/models/bd6fb0ed93f3475b890a099fedecf351/thumbnails/044fa172a0a943d1ac28d63d8d79ef7f/3dcd32444a674e1f9f4dac575cf73357.jpeg"
            alt="Asztali PC komponensek felulnezetbol"
            loading="lazy"
          />
        </figure>
      </section>

      <section aria-labelledby="home-stats-heading">
        <h3 id="home-stats-heading">Gyors statisztikak</h3>
        {isLoading ? <LoadingState text="Statisztikak betoltese..." /> : null}
        {!isLoading && error ? <ErrorState message={error} /> : null}
        {!isLoading && !error ? (
          <div className="card-grid">
            {cards.map((item) => (
              <StatCard key={item.label} label={item.label} value={item.value} />
            ))}
          </div>
        ) : null}
      </section>
    </>
  );
}