import ConfigCard from "../components/ConfigCard";
import PageHeader from "../components/PageHeader";
import { featuredConfigs } from "../data/mockData";

export default function BuilderPage() {
  return (
    <>
      <PageHeader
        title="Konfigurator"
        subtitle="Elore osszeallitott mintak, amelyekbol gyorsan indithato a sajat geped."
      />

      <section className="card-grid" aria-label="Elore definialt konfiguraciok">
        {featuredConfigs.map((config) => (
          <ConfigCard key={config.id} config={config} />
        ))}
      </section>
    </>
  );
}