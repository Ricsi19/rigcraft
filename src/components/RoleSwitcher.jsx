const roles = [
  { value: "visitor", label: "Latogato" },
  { value: "member", label: "Felhasznalo" },
  { value: "admin", label: "Admin" }
];

export default function RoleSwitcher({ role, onRoleChange }) {
  return (
    <fieldset className="role-switcher" aria-label="Interakcios mod">
      <legend className="visually-hidden">Interakcios mod</legend>
      {roles.map((item) => (
        <label key={item.value} className="chip-toggle">
          <input
            type="radio"
            name="role"
            value={item.value}
            checked={role === item.value}
            onChange={(event) => onRoleChange(event.target.value)}
          />
          <span>{item.label}</span>
        </label>
      ))}
    </fieldset>
  );
}