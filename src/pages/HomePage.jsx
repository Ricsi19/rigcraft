import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";

const stats = [
  { label: "Elerheto alkatreszek", value: "1200+" },
  { label: "Elmentett konfiguraciok", value: "358" },
  { label: "Aktiv osszehasonlitasok", value: "79" }
];

export default function HomePage() {
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
          <a className="btn btn-primary" href="/builder">
            Konfigurator megnyitasa
          </a>
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
        <div className="card-grid">
          {stats.map((item) => (
            <StatCard key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      </section>
    </>
  );
}