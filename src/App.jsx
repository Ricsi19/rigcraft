import { Suspense, lazy, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./layout/AppLayout";

const HomePage = lazy(() => import("./pages/HomePage"));
const CatalogPage = lazy(() => import("./pages/CatalogPage"));
const BuilderPage = lazy(() => import("./pages/BuilderPage"));
const ComparePage = lazy(() => import("./pages/ComparePage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function RouteLoader() {
  return (
    <section className="card skeleton-wrapper" aria-live="polite" aria-busy="true">
      <div className="skeleton skeleton-line large"></div>
      <div className="skeleton skeleton-line medium"></div>
      <div className="skeleton skeleton-line"></div>
    </section>
  );
}

export default function App() {
  const [role, setRole] = useState("visitor");

  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        <Route element={<AppLayout role={role} onRoleChange={setRole} />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/builder" element={<BuilderPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}