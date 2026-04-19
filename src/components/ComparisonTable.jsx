function formatTopItems(items) {
  if (!items || items.length === 0) {
    return "-";
  }

  const names = items.map((item) => item.component_name);
  const top = names.slice(0, 3).join(", ");
  if (names.length <= 3) {
    return top;
  }
  return `${top} +${names.length - 3} további`;
}

export default function ComparisonTable({ configurations }) {
  const columns = configurations || [];

  if (columns.length === 0) {
    return (
      <div className="card table-wrap" role="region" aria-label="Konfigurációk összehasonlítása">
        <p className="muted">Ehhez az összehasonlításhoz már nem érhetők el a konfigurációk.</p>
      </div>
    );
  }

  const rows = [
    {
      label: "Cél",
      values: columns.map((config) => config.goal || "-")
    },
    {
      label: "Összár",
      values: columns.map((config) => `${Number(config.total_price_huf || 0).toLocaleString("hu-HU")} Ft`)
    },
    {
      label: "Alkatrészek száma",
      values: columns.map((config) => String(config.items?.length || 0))
    },
    {
      label: "Láthatóság",
      values: columns.map((config) => (config.is_public ? "Nyilvános" : "Privát"))
    },
    {
      label: "Fő alkatrészek",
      values: columns.map((config) => formatTopItems(config.items))
    }
  ];

  return (
    <div className="card table-wrap" role="region" aria-label="Konfigurációk összehasonlítása">
      <table>
        <thead>
          <tr>
            <th scope="col">Jellemző</th>
            {columns.map((config) => (
              <th scope="col" key={config.id}>
                {config.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              {row.values.map((value, index) => (
                <td key={`${row.label}-${index}`}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}