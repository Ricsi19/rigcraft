import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.role_name === "admin";

  const links = [
    { to: "/", label: "Kezdolap" },
    { to: "/catalog", label: "Alkatreszek" },
    ...(isAuthenticated ? [{ to: "/builder", label: "Konfigurator" }] : []),
    ...(isAuthenticated ? [{ to: "/compare", label: "Osszehasonlitas" }] : []),
    ...(isAdmin ? [{ to: "/admin", label: "Admin" }] : []),
    ...(!isAuthenticated ? [{ to: "/login", label: "Bejelentkezes" }] : []),
    ...(!isAuthenticated ? [{ to: "/register", label: "Regisztracio" }] : [])
  ];

  return (
    <nav className="main-nav" aria-label="Fo navigacio">
      <div className="container">
        <ul className="nav-list">
          {links.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  isActive ? "nav-link nav-link-active" : "nav-link"
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}