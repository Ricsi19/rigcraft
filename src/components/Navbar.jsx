import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.role_name === "admin";

  const links = [
    { to: "/", label: "Kezdőlap" },
    { to: "/catalog", label: "Alkatrészek" },
    ...(isAuthenticated ? [{ to: "/builder", label: "Konfigurátor" }] : []),
    ...(isAuthenticated ? [{ to: "/compare", label: "Összehasonlítás" }] : []),
    ...(isAdmin ? [{ to: "/admin", label: "Admin" }] : []),
    ...(!isAuthenticated ? [{ to: "/login", label: "Bejelentkezés" }] : []),
    ...(!isAuthenticated ? [{ to: "/register", label: "Regisztráció" }] : [])
  ];

  return (
    <nav className="main-nav" aria-label="Fő navigáció">
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