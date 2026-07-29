export default function StatusPill({ status }) {
  const normalized = (status || 'pending').toLowerCase();
  return <span className={`pill pill-${normalized}`}>{status}</span>;
}
