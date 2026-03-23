export default function StatCard({ label, value }) {
  return (
    <article className="card stat-card">
      <p className="muted">{label}</p>
      <p className="stat-value">{value}</p>
    </article>
  );
}