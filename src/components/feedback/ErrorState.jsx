export default function ErrorState({ message, onRetry }) {
  return (
    <section className="card empty-state" role="alert" aria-live="assertive">
      <h3>Hiba tortent</h3>
      <p>{message || "Varatlan hiba."}</p>
      {onRetry ? (
        <button className="btn btn-secondary" type="button" onClick={onRetry}>
          Ujraprobalas
        </button>
      ) : null}
    </section>
  );
}
