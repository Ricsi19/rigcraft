import { useOutletContext } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";

export default function AdminPage() {
  const { role } = useOutletContext();

  return (
    <>
      <PageHeader
        title="Admin panel"
        subtitle="A kesobbi merfoldkohoz itt lesz a teljes CRUD kezeles es jogosultsag alapu vezerles."
      />

      {role === "admin" ? (
        <section className="card-grid" aria-label="Admin gyorsmuveletek">
          <article className="card">
            <h3>Alkatresz kezeles</h3>
            <p>Uj alkatresz felvetele, szerkesztese, torlese.</p>
            <button className="btn btn-primary" type="button">
              Modul megnyitasa
            </button>
          </article>
          <article className="card">
            <h3>Konfiguracio sablonok</h3>
            <p>Publikus gepmintak karbantartasa es cimkezese.</p>
            <button className="btn btn-primary" type="button">
              Sablonok kezelese
            </button>
          </article>
        </section>
      ) : (
        <EmptyState
          title="Nincs jogosultsag"
          text="Valts admin modra a jobb felso kapcsoloval az oldal elereshez."
        />
      )}
    </>
  );
}