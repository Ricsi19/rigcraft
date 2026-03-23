export default function ConfigCard({ config }) {
  return (
    <article className="card config-card">
      <h3>{config.name}</h3>
      <p className="muted">Cel: {config.goal}</p>
      <ul className="spec-list">
        <li>CPU: {config.cpu}</li>
        <li>GPU: {config.gpu}</li>
        <li>RAM: {config.ram}</li>
        <li>Tarhely: {config.storage}</li>
      </ul>
      <p className="price-tag">{config.price}</p>
      <button className="btn btn-primary" type="button" aria-label={`${config.name} mentese`}>
        Mentes
      </button>
    </article>
  );
}