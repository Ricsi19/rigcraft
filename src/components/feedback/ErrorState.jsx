export default function ErrorState({ message, onRetry, onGoHome }) {
  return (
    <section className="card empty-state" role="alert" aria-live="assertive">
      <h3>Hiba történt</h3>
      <p>{message || "Váratlan hiba történt."}</p>
      <div className="row gap-sm wrap">
        {onRetry ? (
          <button className="btn btn-secondary" type="button" onClick={onRetry}>
            Újrapróbálás
          </button>
        ) : null}
        {onGoHome ? (
          <button className="btn btn-secondary" type="button" onClick={onGoHome}>
            Vissza a kezdőlapra
          </button>
        ) : null}
      </div>
    </section>
  );
}
