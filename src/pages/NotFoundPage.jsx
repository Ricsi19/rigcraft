import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="card" aria-labelledby="not-found-title">
      <h2 id="not-found-title">404 - Az oldal nem talalhato</h2>
      <p>A keresett URL nem letezik vagy at lett helyezve.</p>
      <Link className="btn btn-primary" to="/">
        Vissza a kezdolapra
      </Link>
    </section>
  );
}