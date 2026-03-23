import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import RoleSwitcher from "../components/RoleSwitcher";
import SkipLink from "../components/SkipLink";

export default function AppLayout({ role, onRoleChange }) {
  return (
    <>
      <SkipLink />
      <header className="top-shell">
        <div className="container row between center gap-md">
          <div>
            <p className="eyebrow">Project Milestone 1</p>
            <h1 className="brand-title">RigCraft</h1>
          </div>
          <RoleSwitcher role={role} onRoleChange={onRoleChange} />
        </div>
        <Navbar />
      </header>

      <main id="main-content" className="container content-stack" tabIndex="-1">
        <Outlet context={{ role }} />
      </main>

      <footer className="site-footer">
        <div className="container row between center gap-sm wrap">
          <p>RigCraft - Szamitogep konfiguracio osszeallito es osszehasonlito</p>
          <p>Demo frontend</p>
        </div>
      </footer>
    </>
  );
}