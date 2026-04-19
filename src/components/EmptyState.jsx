export default function EmptyState({ title, text, actionLabel, onAction }) {
  return (
    <section className="card empty-state" aria-live="polite">
      <h3>{title}</h3>
      <p>{text}</p>
      {actionLabel && onAction ? (
        <button className="btn btn-secondary" type="button" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </section>
  );
}