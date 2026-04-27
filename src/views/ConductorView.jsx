import { useState } from "react";
import ParkingCard from "../components/ParkingCard";
import ParkingMap from "../components/ParkingMap";
import SearchFilters from "../components/SearchFilters";

function ConductorView({ parkings, formatCurrency, onPayParking }) {
  const [filteredParkings, setFilteredParkings] = useState(parkings);
  const [selectedParking, setSelectedParking] = useState(null);

  return (
    <div className="mt-6 space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        {/* Mapa y filtros */}
        <div className="space-y-5">
          <div className="overflow-hidden rounded-[30px] border border-white/40 bg-slate-950 p-5 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">Busqueda cercana</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight">Mapa interactivo</h3>
            <div className="mt-5">
              <ParkingMap 
                parkings={filteredParkings} 
                onSelectParking={setSelectedParking}
                selectedParking={selectedParking}
              />
            </div>
          </div>
        </div>

        {/* Panel de filtros */}
        <div>
          <SearchFilters 
            parkings={parkings}
            onFiltersChange={setFilteredParkings}
          />
        </div>
      </div>

      {/* Listado de parqueos filtrados */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Parqueos disponibles ({filteredParkings.length})
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredParkings.map((parking) => (
            <div key={parking.id} 
              className="cursor-pointer transition transform hover:scale-105"
              onClick={() => setSelectedParking(parking)}
            >
              <ParkingCard
                parking={parking}
                formatCurrency={formatCurrency}
                action={
                  <button
                    className="inline-flex rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 w-full justify-center"
                    type="button"
                    onClick={() => onPayParking(parking.id)}
                  >
                    Pagar 1 hora
                  </button>
                }
              />
            </div>
          ))}
        </div>
        {filteredParkings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 font-medium">No hay parqueos que coincidan con los filtros</p>
            <p className="text-sm text-slate-500 mt-1">Intenta ajustar los criterios de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConductorView;
