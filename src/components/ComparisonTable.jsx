export default function ComparisonTable({ rows }) {
  return (
    <div className="card table-wrap" role="region" aria-label="Konfigurációk összehasonlítása">
      <table>
        <thead>
          <tr>
            <th scope="col">Jellemző</th>
            <th scope="col">Esport Build</th>
            <th scope="col">Creator Build</th>
            <th scope="col">Budget Build</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              <td>{row.esport}</td>
              <td>{row.creator}</td>
              <td>{row.budget}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}