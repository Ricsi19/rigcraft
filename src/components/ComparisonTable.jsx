export default function ComparisonTable({ rows }) {
  return (
    <div className="card table-wrap" role="region" aria-label="Konfigurációk összehasonlítása">
      <table>
        <thead>
          <tr>
            <th scope="col">Sorrend</th>
            <th scope="col">Konfiguráció neve</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.rank_order}-${row.configuration_name}`}>
              <th scope="row">#{row.rank_order}</th>
              <td>{row.configuration_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}