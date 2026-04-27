import UserBadge from "./UserBadge";

function DashboardShell({ currentUser, onLogout, title, description, children }) {
  return (
    <section className="rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_30px_100px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">Vista activa</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>
        <UserBadge currentUser={currentUser} onLogout={onLogout} />
      </div>

      {children}
    </section>
  );
}

export default DashboardShell;
