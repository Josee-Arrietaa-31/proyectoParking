import { useState } from "react";

function SearchFilters({ parkings, onFiltersChange }) {
  const [filters, setFilters] = useState({
    maxPrice: 2000,
    minPrice: 0,
    availableOnly: false,
    type: "todos",
    zone: "todas",
    minRating: 0,
    minCapacity: 0,
    maxOccupancy: 100
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Extraer zonas únicas
  const zones = ["todas", ...new Set(parkings.map(p => p.zone).filter(Boolean))];

  // Extraer calificaciones de parqueos (simulado con ratings)
  const getParkingRating = (parkingId) => {
    // Aquí iría lógica para calcular rating desde ratings array
    // Por ahora retorna 0 como default
    return 0;
  };

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    
    // Aplicar filtros
    const filtered = parkings.filter((parking) => {
      // Disponibilidad
      if (newFilters.availableOnly && parking.availableSpots === 0) return false;
      
      // Rango de precio
      if (parking.ratePerHour < newFilters.minPrice || parking.ratePerHour > newFilters.maxPrice) return false;
      
      // Tipo
      if (newFilters.type !== "todos" && parking.type !== newFilters.type) return false;
      
      // Zona
      if (newFilters.zone !== "todas" && parking.zone !== newFilters.zone) return false;
      
      // Capacidad mínima
      if (parking.capacity < newFilters.minCapacity) return false;
      
      // Ocupación máxima
      const occupancy = parking.capacity > 0 ? ((parking.capacity - parking.availableSpots) / parking.capacity) * 100 : 0;
      if (occupancy > newFilters.maxOccupancy) return false;
      
      return true;
    });

    onFiltersChange(filtered);
  };

  const handleReset = () => {
    const defaultFilters = {
      maxPrice: 2000,
      minPrice: 0,
      availableOnly: false,
      type: "todos",
      zone: "todas",
      minRating: 0,
      minCapacity: 0,
      maxOccupancy: 100
    };
    setFilters(defaultFilters);
    onFiltersChange(parkings);
  };

  const availableCount = parkings.filter((p) => p.availableSpots > 0).length;
  const totalParkings = parkings.length;
  
  // Contar parqueos filtrados
  const filteredCount = parkings.filter((parking) => {
    if (filters.availableOnly && parking.availableSpots === 0) return false;
    if (parking.ratePerHour < filters.minPrice || parking.ratePerHour > filters.maxPrice) return false;
    if (filters.type !== "todos" && parking.type !== filters.type) return false;
    if (filters.zone !== "todas" && parking.zone !== filters.zone) return false;
    if (parking.capacity < filters.minCapacity) return false;
    const occupancy = parking.capacity > 0 ? ((parking.capacity - parking.availableSpots) / parking.capacity) * 100 : 0;
    if (occupancy > filters.maxOccupancy) return false;
    return true;
  }).length;

  const isFiltered = filters.availableOnly || filters.minPrice > 0 || filters.maxPrice < 2000 || 
                     filters.type !== "todos" || filters.zone !== "todas" || filters.minCapacity > 0 || 
                     filters.maxOccupancy < 100;

  return (
    <div className="rounded-[28px] border border-white/40 bg-white/70 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">Filtros</p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">Buscar parqueo</h3>
        </div>
        {isFiltered && (
          <button
            onClick={handleReset}
            className="text-xs font-semibold px-3 py-1.5 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="mt-5 space-y-5">
        {/* Filtros principales */}
        <div className="grid grid-cols-2 gap-3">
          {/* Filtro por disponibilidad */}
          <label className="flex items-center gap-2 cursor-pointer col-span-2">
            <input
              type="checkbox"
              checked={filters.availableOnly}
              onChange={(e) => handleFilterChange("availableOnly", e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium text-slate-700">
              Solo disponibles ({availableCount}/{totalParkings})
            </span>
          </label>
        </div>

        {/* Rango de precio */}
        <div>
          <label className="block mb-2">
            <span className="text-sm font-medium text-slate-700">
              Rango de tarifa: ₡{filters.minPrice} - ₡{filters.maxPrice}/hora
            </span>
          </label>
          <div className="flex gap-2">
            <input
              type="range"
              min="0"
              max="2000"
              step="100"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange("minPrice", parseInt(e.target.value))}
              className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="range"
              min="0"
              max="2000"
              step="100"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange("maxPrice", parseInt(e.target.value))}
              className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>₡0</span>
            <span>₡2000</span>
          </div>
        </div>

        {/* Tipo de parqueo */}
        <div>
          <label className="block mb-2">
            <span className="text-sm font-medium text-slate-700">Tipo</span>
          </label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-white/70 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-200"
          >
            <option value="todos">Todos los tipos</option>
            <option value="privado">🔒 Privado</option>
            <option value="publico">🔓 Público</option>
          </select>
        </div>

        {/* Zona */}
        <div>
          <label className="block mb-2">
            <span className="text-sm font-medium text-slate-700">Zona</span>
          </label>
          <select
            value={filters.zone}
            onChange={(e) => handleFilterChange("zone", e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-white/70 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-200"
          >
            {zones.map(zone => (
              <option key={zone} value={zone}>
                {zone === "todas" ? "Todas las zonas" : `📍 ${zone}`}
              </option>
            ))}
          </select>
        </div>

        {/* Botón para mostrar/ocultar filtros avanzados */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full text-xs font-medium text-slate-600 hover:text-slate-900 transition py-2 border-t border-slate-200"
        >
          {showAdvanced ? "▼ Ocultar filtros avanzados" : "▶ Mostrar filtros avanzados"}
        </button>

        {/* Filtros avanzados */}
        {showAdvanced && (
          <div className="pt-5 space-y-4 border-t border-slate-200">
            {/* Capacidad mínima */}
            <div>
              <label className="block mb-2">
                <span className="text-sm font-medium text-slate-700">
                  Capacidad mínima: {filters.minCapacity} espacios
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={filters.minCapacity}
                onChange={(e) => handleFilterChange("minCapacity", parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Ocupación máxima */}
            <div>
              <label className="block mb-2">
                <span className="text-sm font-medium text-slate-700">
                  Ocupación máxima: {filters.maxOccupancy}%
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={filters.maxOccupancy}
                onChange={(e) => handleFilterChange("maxOccupancy", parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Información de filtrado */}
        <div className={`p-3 rounded-xl border transition ${
          isFiltered 
            ? 'bg-blue-50 border-blue-200' 
            : 'bg-emerald-50 border-emerald-200'
        }`}>
          <p className={`text-xs ${isFiltered ? 'text-blue-800' : 'text-emerald-800'}`}>
            <strong>💡 Resultado:</strong> Se muestran {filteredCount} de {totalParkings} parqueos
          </p>
        </div>
      </div>
    </div>
  );
}

export default SearchFilters;
