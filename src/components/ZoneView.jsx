import { useState } from "react";
import ZoneSelector from "./ZoneSelector";
import ParkingCard from "./ParkingCard";

function ZoneView({ parkings, ratings, formatCurrency, onPayParking, onShowRatingModal }) {
  const [selectedZone, setSelectedZone] = useState(null);

  const zonesWithParkings = {};
  parkings.forEach((parking) => {
    const zone = parking.zone || "Otros";
    if (!zonesWithParkings[zone]) {
      zonesWithParkings[zone] = [];
    }
    zonesWithParkings[zone].push(parking);
  });

  const selectedParkings = selectedZone ? (zonesWithParkings[selectedZone] || []) : [];

  return (
    <div className="space-y-6">
      <div className="rounded-[30px] border border-white/40 bg-slate-950 p-5 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-300">Búsqueda por zona</p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight">Explora tu zona</h3>
        <p className="mt-2 text-sm text-slate-400">Selecciona una zona para ver todos los parqueos disponibles</p>

        <div className="mt-6">
          <ZoneSelector
            selectedZone={selectedZone}
            onZoneChange={setSelectedZone}
            parkingCount={selectedParkings.length}
          />
        </div>
      </div>

      {selectedZone && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Parqueos en {selectedZone} ({selectedParkings.length})
          </h3>

          {selectedParkings.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {selectedParkings.map((parking) => (
                <div key={parking.id} className="space-y-3">
                  <ParkingCard
                    parking={parking}
                    formatCurrency={formatCurrency}
                    ratings={ratings}
                    action={
                      <div className="flex flex-col gap-2">
                        <button
                          className="inline-flex rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 w-full justify-center"
                          type="button"
                          onClick={() => onPayParking(parking.id)}
                        >
                          Pagar 1 hora
                        </button>
                        <button
                          className="inline-flex rounded-2xl bg-blue-100 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-200 w-full justify-center"
                          type="button"
                          onClick={() => onShowRatingModal(parking)}
                        >
                          ⭐ Ver calificaciones
                        </button>
                      </div>
                    }
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 font-medium">No hay parqueos en esta zona</p>
              <p className="text-sm text-slate-500 mt-1">Intenta seleccionar otra zona</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ZoneView;
