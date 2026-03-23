import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Kezdolap" },
  { to: "/catalog", label: "Alkatreszek" },
  { to: "/builder", label: "Konfigurator" },
  { to: "/compare", label: "Osszehasonlitas" },
  { to: "/admin", label: "Admin" }
];

export default function Navbar() {
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