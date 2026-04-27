import StatCard from "./StatCard";

function GuestOverview({ summary, formatCurrency }) {
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[30px] bg-slate-950 p-6 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">MVP del sprint</p>
        <h3 className="mt-4 text-3xl font-semibold tracking-tight">Una base lista para crecer</h3>
        <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
          La app ya funciona con React, Tailwind y una API local. El siguiente paso natural es modularizar componentes y conectar mapa o base de datos real.
        </p>
      </div>
      <div className="grid gap-4">
        <StatCard label="Ingresos acumulados" value={formatCurrency(summary.totalRevenue || 0)} accent="text-emerald-700" />
        <StatCard label="Espacios disponibles" value={summary.totalAvailable || 0} accent="text-cyan-700" />
      </div>
    </div>
  );
}

export default GuestOverview;
