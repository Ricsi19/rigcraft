export default function LoadingState({ text = "Betöltés folyamatban..." }) {
  return (
    <section className="card skeleton-wrapper" aria-live="polite" aria-busy="true">
      <div className="skeleton skeleton-line large"></div>
      <div className="skeleton skeleton-line medium"></div>
      <div className="skeleton skeleton-line"></div>
      <p className="muted">{text}</p>
    </section>
  );
}
