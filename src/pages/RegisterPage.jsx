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
      setServerError(error.message || "Sikertelen regisztracio.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="container content-stack auth-page">
      <PageHeader
        title="Regisztracio"
        subtitle="Email/jelszo alapu regisztracio kliens es szerver oldali validacioval."
      />

      <section className="card auth-card" aria-labelledby="register-form-title">
        <h3 id="register-form-title">Uj fiok letrehozasa</h3>
        <form className="stack" onSubmit={handleSubmit} noValidate>
          <label>
            <span>Megjelenitesi nev</span>
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
            <span>Jelszo</span>
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
              Jelszo szabaly: legalabb 8 karakter, 1 nagybetu, 1 szam, 1 specialis karakter.
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
            {isSubmitting ? "Regisztracio..." : "Regisztracio"}
          </button>
        </form>

        <p>
          Van mar fiokod? <Link to="/login">Lepj be itt</Link>
        </p>
      </section>
    </main>
  );
}
