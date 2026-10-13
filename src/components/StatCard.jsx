export default function StatCard({
  label,
  value,
  note,
  icon
}) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <p>{label}</p>
        <span aria-hidden="true">{icon}</span>
      </div>

      <h2>{value}</h2>
      <p className="small-text">{note}</p>
    </article>
  );
}