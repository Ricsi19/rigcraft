import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="card" aria-labelledby="not-found-title">
      <h2 id="not-found-title">404 - Az oldal nem található</h2>
      <p>A keresett oldal nem létezik, vagy időközben áthelyeztük.</p>
      <Link className="btn btn-primary" to="/">
        Vissza a kezdőlapra
      </Link>
    </section>
  );
}