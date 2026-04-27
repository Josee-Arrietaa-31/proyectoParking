function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-[28px] border border-white/40 bg-white/70 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">{label}</p>
      <p className={`mt-3 text-3xl font-semibold tracking-tight ${accent}`}>{value}</p>
    </div>
  );
}

export default StatCard;
