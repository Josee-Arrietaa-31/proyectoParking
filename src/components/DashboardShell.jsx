import UserBadge from "./UserBadge";

function DashboardShell({ currentUser, onLogout, title, description, children, isDarkMode, toggleTheme }) {
  return (
    <section className="rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_30px_100px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-700 dark:bg-slate-800/70 dark:shadow-[0_30px_100px_rgba(0,0,0,0.4)]">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between dark:border-slate-700">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700 dark:text-cyan-500">Vista activa</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="rounded-lg bg-slate-100 p-2 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
            title={isDarkMode ? "Modo claro" : "Modo oscuro"}
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
          <UserBadge currentUser={currentUser} onLogout={onLogout} />
        </div>
      </div>

      {children}
    </section>
  );
}

export default DashboardShell;
