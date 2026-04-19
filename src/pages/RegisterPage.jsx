import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../auth/AuthContext";
import { getPasswordErrors, validateRegisterForm } from "../utils/authValidation";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ email: "", displayName: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordHints = getPasswordErrors(form.password);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateRegisterForm(form);
    setErrors(nextErrors);
    setServerError("");
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await register(form);
      navigate("/", { replace: true });
    } catch (error) {
      setServerError(error.message || "Sikertelen regisztráció.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="container content-stack auth-page">
      <PageHeader
        title="Regisztráció"
        subtitle="Hozz létre fiókot pár lépésben, és mentsd el a saját konfigurációidat."
      />

      <div className="row gap-sm wrap">
        <Link className="btn btn-secondary" to="/">
          Vissza a kezdőoldalra
        </Link>
      </div>

      <section className="card auth-card" aria-labelledby="register-form-title">
        <h3 id="register-form-title">Új fiók létrehozása</h3>
        <form className="stack" onSubmit={handleSubmit} noValidate>
          <label>
            <span>Megjelenítési név</span>
            <input
              type="text"
              value={form.displayName}
              onChange={(event) => updateField("displayName", event.target.value)}
              aria-describedby={errors.displayName ? "register-name-error" : undefined}
              required
            />
          </label>
          {errors.displayName ? (
            <p id="register-name-error" className="field-error">
              {errors.displayName}
            </p>
          ) : null}

          <label>
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              aria-describedby={errors.email ? "register-email-error" : undefined}
              required
            />
          </label>
          {errors.email ? (
            <p id="register-email-error" className="field-error">
              {errors.email}
            </p>
          ) : null}

          <label>
            <span>Jelszó</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              aria-describedby={errors.password ? "register-password-error" : "register-password-help"}
              required
            />
          </label>
          {errors.password ? (
            <p id="register-password-error" className="field-error">
              {errors.password}
            </p>
          ) : (
            <p id="register-password-help" className="muted">
              Jelszó szabály: legalább 8 karakter, 1 nagybetű, 1 szám, 1 speciális karakter.
            </p>
          )}

          {passwordHints.length > 0 ? (
            <ul className="password-hints">
              {passwordHints.map((hint) => (
                <li key={hint}>{hint}</li>
              ))}
            </ul>
          ) : null}

          {serverError ? <p className="field-error">{serverError}</p> : null}

          <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Regisztráció..." : "Regisztráció"}
          </button>
        </form>

        <p>
          Van már fiókod? <Link to="/login">Lépj be itt</Link>
        </p>
      </section>
    </main>
  );
}
