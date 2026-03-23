import ComparisonTable from "../components/ComparisonTable";
import PageHeader from "../components/PageHeader";
import { comparisonRows } from "../data/mockData";

export default function ComparePage() {
  return (
    <>
      <PageHeader
        title="Konfiguracio osszehasonlitas"
        subtitle="Teljesitmeny, ar es fogyasztas alapjan hasonlitsd ossze az osszeallitasokat."
      />

      <ComparisonTable rows={comparisonRows} />
    </>
  );
}