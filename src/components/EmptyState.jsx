export default function EmptyState({ title, text }) {
  return (
    <section className="card empty-state" aria-live="polite">
      <h3>{title}</h3>
      <p>{text}</p>
    </section>
  );
}