export default function PageHeader({ title, subtitle }) {
  return (
    <header className="page-header card">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </header>
  );
}