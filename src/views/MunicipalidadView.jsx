import ParkingCard from "../components/ParkingCard";
import StatCard from "../components/StatCard";

function MunicipalidadView({ summary, parkings, formatCurrency }) {
  return (
    <div className="mt-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Parqueos" value={summary.totalParkings || 0} accent="text-slate-900" />
        <StatCard label="Capacidad" value={summary.totalCapacity || 0} accent="text-cyan-700" />
        <StatCard label="Ocupados" value={summary.occupiedSpots || 0} accent="text-amber-700" />
        <StatCard label="Disponibles" value={summary.totalAvailable || 0} accent="text-emerald-700" />
        <StatCard label="Ingresos" value={formatCurrency(summary.totalRevenue || 0)} accent="text-violet-700" />
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        {parkings.map((parking) => (
          <ParkingCard key={parking.id} parking={parking} formatCurrency={formatCurrency} />
        ))}
      </div>
    </div>
  );
}

export default MunicipalidadView;
