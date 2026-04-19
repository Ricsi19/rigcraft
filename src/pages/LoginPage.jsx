import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../auth/AuthContext";
import { validateLoginForm } from "../utils/authValidation";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fromPath = location.state?.from?.pathname || "/";

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateLoginForm(form);
    setErrors(nextErrors);
    setServerError("");
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await login(form);
      navigate(fromPath, { replace: true });
    } catch (error) {
      setServerError(error.message || "Sikertelen bejelentkezés.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="container content-stack auth-page">
      <PageHeader
        title="Bejelentkezés"
        subtitle="Add meg az e-mail címedet és a jelszavadat a folytatáshoz."
      />

      <div className="row gap-sm wrap">
        <Link className="btn btn-secondary" to="/">
          Vissza a kezdőoldalra
        </Link>
      </div>

      <section className="card auth-card" aria-labelledby="login-form-title">
        <h3 id="login-form-title">Belépés</h3>
        <form className="stack" onSubmit={handleSubmit} noValidate>
          <label>
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              aria-describedby={errors.email ? "login-email-error" : undefined}
              required
            />
          </label>
          {errors.email ? (
            <p id="login-email-error" className="field-error">
              {errors.email}
            </p>
          ) : null}

          <label>
            <span>Jelszó</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              aria-describedby={errors.password ? "login-password-error" : undefined}
              required
            />
          </label>
          {errors.password ? (
            <p id="login-password-error" className="field-error">
              {errors.password}
            </p>
          ) : null}

          {serverError ? <p className="field-error">{serverError}</p> : null}

          <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Bejelentkezés..." : "Bejelentkezés"}
          </button>
        </form>

        <p>
          Nincs fiókod? <Link to="/register">Regisztrálj itt</Link>
        </p>
      </section>
    </main>
  );
}
