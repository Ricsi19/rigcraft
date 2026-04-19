export function isValidEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test((email || "").trim());
}

export function getPasswordErrors(password) {
  const value = password || "";
  const errors = [];
  if (value.length < 8) {
    errors.push("A jelszo legalabb 8 karakter legyen.");
  }
  if (!/[A-Z]/.test(value)) {
    errors.push("A jelszo tartalmazzon legalabb egy nagybetut.");
  }
  if (!/[0-9]/.test(value)) {
    errors.push("A jelszo tartalmazzon legalabb egy szamot.");
  }
  if (!/[^A-Za-z0-9]/.test(value)) {
    errors.push("A jelszo tartalmazzon legalabb egy specialis karaktert.");
  }
  return errors;
}

export function validateRegisterForm({ email, displayName, password }) {
  const errors = {};
  if (!isValidEmail(email)) {
    errors.email = "Adj meg ervenyes email cimet.";
  }
  if (!displayName || displayName.trim().length < 2) {
    errors.displayName = "A nev legalabb 2 karakter legyen.";
  }
  const passwordErrors = getPasswordErrors(password);
  if (passwordErrors.length > 0) {
    errors.password = passwordErrors[0];
  }
  return errors;
}

export function validateLoginForm({ email, password }) {
  const errors = {};
  if (!isValidEmail(email)) {
    errors.email = "Adj meg ervenyes email cimet.";
  }
  if (!password || password.length < 8) {
    errors.password = "A jelszo legalabb 8 karakter legyen.";
  }
  return errors;
}
