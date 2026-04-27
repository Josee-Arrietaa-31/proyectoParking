function ParkingCard({ parking, formatCurrency, action }) {
  return (
    <article className="rounded-[28px] border border-white/40 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-800">
            {parking.type}
          </span>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-900">{parking.name}</h3>
        </div>
        <div className="rounded-2xl bg-slate-950 px-3 py-2 text-right text-white">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300">Tarifa</p>
          <p className="text-sm font-semibold">{formatCurrency(parking.ratePerHour)}</p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
        <p>
          Disponibles: <span className="font-semibold text-slate-900">{parking.availableSpots}</span> de {parking.capacity}
        </p>
        <p>
          Ubicacion: <span className="font-semibold text-slate-900">{parking.latitude}, {parking.longitude}</span>
        </p>
      </div>
      {action ? <div className="mt-5">{action}</div> : null}
    </article>
  );
}

export default ParkingCard;
