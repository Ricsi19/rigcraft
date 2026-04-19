export function isValidEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test((email || "").trim());
}

export function getPasswordErrors(password) {
  const value = password || "";
  const errors = [];
  if (value.length < 8) {
    errors.push("A jelszó legalább 8 karakter legyen.");
  }
  if (!/[A-Z]/.test(value)) {
    errors.push("A jelszó tartalmazzon legalább egy nagybetűt.");
  }
  if (!/[0-9]/.test(value)) {
    errors.push("A jelszó tartalmazzon legalább egy számot.");
  }
  if (!/[^A-Za-z0-9]/.test(value)) {
    errors.push("A jelszó tartalmazzon legalább egy speciális karaktert.");
  }
  return errors;
}

export function validateRegisterForm({ email, displayName, password }) {
  const errors = {};
  if (!isValidEmail(email)) {
    errors.email = "Adj meg érvényes e-mail címet.";
  }
  if (!displayName || displayName.trim().length < 2) {
    errors.displayName = "A név legalább 2 karakter legyen.";
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
    errors.email = "Adj meg érvényes e-mail címet.";
  }
  if (!password || password.length < 8) {
    errors.password = "A jelszó legalább 8 karakter legyen.";
  }
  return errors;
}
