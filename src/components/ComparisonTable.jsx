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

  function totalEstimatedWatt(items) {
    return (items || []).reduce((sum, item) => {
      const watt = Number(item.component_watt_usage || 0);
      return sum + watt * Number(item.quantity || 0);
    }, 0);
  }

  function totalItemCount(items) {
    return (items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  }

  function mostExpensiveItem(items) {
    if (!items || items.length === 0) {
      return "-";
    }

    let max = null;
    for (const item of items) {
      const unitPrice = Number(item.component_price_huf || 0);
      const linePrice = unitPrice * Number(item.quantity || 0);
      if (!max || linePrice > max.linePrice) {
        max = { name: item.component_name, linePrice };
      }
    }

    if (!max) {
      return "-";
    }
    return `${max.name} (${max.linePrice.toLocaleString("hu-HU")} Ft)`;
  }

  function pickByCategory(items, categoryName) {
    const match = (items || []).find(
      (item) => (item.component_category_name || "").toLowerCase() === categoryName.toLowerCase()
    );
    return match ? match.component_name : "-";
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
      values: columns.map((config) => String(totalItemCount(config.items)))
    },
    {
      label: "Láthatóság",
      values: columns.map((config) => (config.is_public ? "Nyilvános" : "Privát"))
    },
    {
      label: "Becsült fogyasztás",
      values: columns.map((config) => `${totalEstimatedWatt(config.items).toLocaleString("hu-HU")} W`)
    },
    {
      label: "Legdrágább tétel",
      values: columns.map((config) => mostExpensiveItem(config.items))
    },
    {
      label: "CPU",
      values: columns.map((config) => pickByCategory(config.items, "CPU"))
    },
    {
      label: "GPU",
      values: columns.map((config) => pickByCategory(config.items, "GPU"))
    },
    {
      label: "RAM",
      values: columns.map((config) => pickByCategory(config.items, "RAM"))
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