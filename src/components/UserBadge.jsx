function UserBadge({ currentUser, onLogout }) {
  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-slate-950 px-4 py-3 text-sm text-white">
      <div>
        <p className="font-semibold">{currentUser.name}</p>
        <p className="text-slate-300">{currentUser.email}</p>
      </div>
      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
        {currentUser.role}
      </span>
      <button className="rounded-xl border border-white/15 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/10" type="button" onClick={onLogout}>
        Salir
      </button>
    </div>
  );
}

export default UserBadge;
