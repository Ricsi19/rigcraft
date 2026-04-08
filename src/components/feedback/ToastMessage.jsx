import { useEffect } from "react";

export default function ToastMessage({ toast, onClose }) {
  useEffect(() => {
    if (!toast) {
      return;
    }
    const timerId = window.setTimeout(() => {
      onClose();
    }, 2800);

    return () => window.clearTimeout(timerId);
  }, [toast, onClose]);

  if (!toast) {
    return null;
  }

  return (
    <div className={`toast toast-${toast.type || "info"}`} role="status" aria-live="polite">
      <p>{toast.message}</p>
      <button type="button" className="btn btn-secondary" onClick={onClose}>
        Bezar
      </button>
    </div>
  );
}
