import { useState } from "react";

function SearchFilters({ parkings, onFiltersChange }) {
  const [filters, setFilters] = useState({
    maxPrice: 2000,
    availableOnly: false,
    type: "todos",
  });

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    
    // Filtrar parqueos
    const filtered = parkings.filter((parking) => {
      if (newFilters.availableOnly && parking.availableSpots === 0) return false;
      if (parking.ratePerHour > newFilters.maxPrice) return false;
      if (newFilters.type !== "todos" && parking.type !== newFilters.type) return false;
      return true;
    });

    onFiltersChange(filtered);
  };

  const availableCount = parkings.filter((p) => p.availableSpots > 0).length;
  const totalParkings = parkings.length;

  return (
    <div className="rounded-[28px] border border-white/40 bg-white/70 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">Filtros</p>
      <h3 className="mt-3 text-lg font-semibold tracking-tight text-slate-900">Buscar parqueo</h3>

      <div className="mt-5 space-y-5">
        {/* Filtro por disponibilidad */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.availableOnly}
              onChange={(e) => handleFilterChange("availableOnly", e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium text-slate-700">
              Solo con espacios disponibles ({availableCount}/{totalParkings})
            </span>
          </label>
        </div>

        {/* Filtro por precio */}
        <div>
          <label className="block mb-2">
            <span className="text-sm font-medium text-slate-700">
              Precio máximo: ₡{filters.maxPrice}/hora
            </span>
          </label>
          <input
            type="range"
            min="100"
            max="2000"
            step="100"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange("maxPrice", parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>₡100</span>
            <span>₡2000</span>
          </div>
        </div>

        {/* Filtro por tipo */}
        <div>
          <label className="block mb-2">
            <span className="text-sm font-medium text-slate-700">Tipo de parqueo</span>
          </label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            className="w-full rounded-2xl border border-white/20 bg-white/70 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-200"
          >
            <option value="todos">Todos los tipos</option>
            <option value="privado">Privado</option>
            <option value="publico">Público</option>
          </select>
        </div>

        {/* Información de filtrado */}
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
          <p className="text-xs text-emerald-800">
            <strong>💡 Tip:</strong> Se muestran {
              parkings.filter((p) => {
                if (filters.availableOnly && p.availableSpots === 0) return false;
                if (p.ratePerHour > filters.maxPrice) return false;
                if (filters.type !== "todos" && p.type !== filters.type) return false;
                return true;
              }).length
            } de {totalParkings} parqueos
          </p>
        </div>
      </div>
    </div>
  );
}

export default SearchFilters;
