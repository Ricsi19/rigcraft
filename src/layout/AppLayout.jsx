import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Navbar from "../components/Navbar";
import SkipLink from "../components/SkipLink";
import ToastMessage from "../components/feedback/ToastMessage";
import { useAppData } from "../store/AppDataContext";

export default function AppLayout() {
  const { state, dispatch } = useAppData();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const role = user?.role_name || "visitor";
  const roleLabel = {
    visitor: "Vendég",
    member: "Felhasználó",
    admin: "Admin"
  }[role] || "Vendég";

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <>
      <SkipLink />
      <header className="top-shell">
        <div className="container row between center gap-md">
          <div>
            <p className="eyebrow">PC konfigurátor és összehasonlító</p>
            <h1 className="brand-title">RigCraft</h1>
          </div>
          <div className="row gap-sm center wrap">
            <span className="chip-label">Szerepkör: {roleLabel}</span>
            {isAuthenticated ? (
              <>
                <span className="chip-label">Belépve: {user.display_name}</span>
                <button type="button" className="btn btn-secondary" onClick={handleLogout}>
                  Kijelentkezés
                </button>
              </>
            ) : (
              <span className="chip-label">Nincs bejelentkezve</span>
            )}
          </div>
        </div>
        <Navbar />
      </header>

      <main id="main-content" className="container content-stack" tabIndex="-1">
        <Outlet context={{ role }} />
      </main>

      <footer className="site-footer">
        <div className="container row between center gap-sm wrap">
          <p>RigCraft - Számítógép konfiguráció összeállító és összehasonlító</p>
          <p>Tervezd meg az ideális gépedet egyszerűen.</p>
        </div>
      </footer>

      <ToastMessage
        toast={state.toast}
        onClose={() => dispatch({ type: "SET_TOAST", payload: null })}
      />
    </>
  );
}