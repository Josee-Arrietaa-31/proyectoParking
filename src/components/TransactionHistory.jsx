import { useState } from "react";

function TransactionHistory({ payments, parkings, currentUser, formatCurrency }) {
  const [sortBy, setSortBy] = useState("recent");
  const [filterMonth, setFilterMonth] = useState("all");

  // Filtrar pagos del usuario actual
  const userPayments = payments.filter((p) => p.conductorId === currentUser.id);

  // Obtener mes/año de la fecha
  const getMonthYear = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  };

  // Filtrar por mes
  let filtered = userPayments;
  if (filterMonth !== "all") {
    filtered = filtered.filter((p) => getMonthYear(p.createdAt) === filterMonth);
  }

  // Ordenar
  let sorted = [...filtered];
  if (sortBy === "recent") {
    sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortBy === "oldest") {
    sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (sortBy === "amount-high") {
    sorted.sort((a, b) => b.amount - a.amount);
  } else if (sortBy === "amount-low") {
    sorted.sort((a, b) => a.amount - b.amount);
  }

  // Calcular estadísticas
  const stats = {
    totalTransactions: userPayments.length,
    totalSpent: userPayments.reduce((sum, p) => sum + p.amount, 0),
    totalHours: userPayments.reduce((sum, p) => sum + p.hours, 0),
    averageTransaction: userPayments.length > 0 ? Math.round(userPayments.reduce((sum, p) => sum + p.amount, 0) / userPayments.length) : 0
  };

  // Obtener nombre del parqueo
  const getParkingName = (parkingId) => {
    const parking = parkings.find((p) => p.id === parkingId);
    return parking ? parking.name : "Parqueo desconocido";
  };

  // Formatear fecha
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  // Obtener meses únicos para filtro
  const uniqueMonths = Array.from(
    new Set(userPayments.map((p) => getMonthYear(p.createdAt)))
  ).sort().reverse();

  return (
    <div className="mt-6 space-y-6">
      {/* Estadísticas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[24px] border border-white/40 bg-white/70 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Total de transacciones</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{stats.totalTransactions}</p>
        </div>
        <div className="rounded-[24px] border border-white/40 bg-white/70 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Total gastado</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">{formatCurrency(stats.totalSpent)}</p>
        </div>
        <div className="rounded-[24px] border border-white/40 bg-white/70 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Total de horas</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">{stats.totalHours}h</p>
        </div>
        <div className="rounded-[24px] border border-white/40 bg-white/70 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Promedio por pago</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">{formatCurrency(stats.averageTransaction)}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="rounded-[28px] border border-white/40 bg-white/70 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Filtros y ordenamiento</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block mb-2">
              <span className="text-sm font-medium text-slate-700">Mes</span>
            </label>
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="w-full rounded-2xl border border-white/20 bg-white/70 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-200"
            >
              <option value="all">Todos los meses</option>
              {uniqueMonths.map((month) => {
                const [year, monthNum] = month.split("-");
                const monthName = new Date(`${year}-${monthNum}-01`).toLocaleString("es-ES", {
                  month: "long",
                  year: "numeric"
                });
                return (
                  <option key={month} value={month}>
                    {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block mb-2">
              <span className="text-sm font-medium text-slate-700">Ordenar por</span>
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-2xl border border-white/20 bg-white/70 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-200"
            >
              <option value="recent">Más recientes primero</option>
              <option value="oldest">Más antiguos primero</option>
              <option value="amount-high">Mayor monto primero</option>
              <option value="amount-low">Menor monto primero</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de transacciones */}
      <div className="overflow-hidden rounded-[28px] border border-white/40 bg-white/70 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Fecha y hora</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Parqueo</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Duración</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Monto</th>
              </tr>
            </thead>
            <tbody>
              {sorted.length > 0 ? (
                sorted.map((payment) => (
                  <tr key={payment.id} className="border-b border-slate-100 hover:bg-emerald-50/30 transition">
                    <td className="px-6 py-4 text-sm text-slate-700">{formatDate(payment.createdAt)}</td>
                    <td className="px-6 py-4 text-sm text-slate-700 font-medium">{getParkingName(payment.parkingId)}</td>
                    <td className="px-6 py-4 text-center text-sm text-slate-700">
                      <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-blue-700 font-medium">
                        ⏱ {payment.hours}h
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-emerald-600">
                      {formatCurrency(payment.amount)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                    <p className="text-sm">No hay transacciones en este período</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {sorted.length > 0 && (
          <div className="border-t border-slate-200 bg-slate-50/50 px-6 py-4 flex justify-between items-center">
            <p className="text-sm text-slate-600">
              Mostrando <strong>{sorted.length}</strong> de <strong>{userPayments.length}</strong> transacciones
            </p>
            <p className="text-sm font-semibold text-slate-900">
              Total filtrado: <span className="text-emerald-600">{formatCurrency(sorted.reduce((sum, p) => sum + p.amount, 0))}</span>
            </p>
          </div>
        )}
      </div>

      {userPayments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600 text-lg font-medium">No tienes transacciones aún</p>
          <p className="text-slate-500 text-sm mt-2">Realiza un pago en un parqueo para ver tu historial aquí</p>
        </div>
      )}
    </div>
  );
}

export default TransactionHistory;
