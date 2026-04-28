import { useState } from "react";
import ZoneSelector from "./ZoneSelector";

function ZoneView({ parkings, ratings, formatCurrency, onPayParking, onShowRatingModal }) {
  const [selectedZone, setSelectedZone] = useState(null);
  const [openMapMenu, setOpenMapMenu] = useState(null); // null o parkingId

  const zonesWithParkings = {};
  parkings.forEach((parking) => {
    const zone = parking.zone || "Otros";
    if (!zonesWithParkings[zone]) {
      zonesWithParkings[zone] = [];
    }
    zonesWithParkings[zone].push(parking);
  });

  const selectedParkings = selectedZone ? (zonesWithParkings[selectedZone] || []) : [];

  const handleOpenGoogleMaps = (parking) => {
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(parking.address)}/@${parking.latitude},${parking.longitude},17z`;
    window.open(mapsUrl, "_blank");
    setOpenMapMenu(null);
  };

  const handleOpenWaze = (parking) => {
    const wazeUrl = `https://waze.com/ul?ll=${parking.latitude},${parking.longitude}&navigate=yes`;
    window.open(wazeUrl, "_blank");
    setOpenMapMenu(null);
  };

  const getAvailabilityColor = (parking) => {
    const percentage = (parking.availableSpots / parking.capacity) * 100;
    if (percentage > 50) return "bg-emerald-50 border-emerald-200";
    if (percentage > 20) return "bg-amber-50 border-amber-200";
    return "bg-rose-50 border-rose-200";
  };

  const getAvailabilityBadge = (parking) => {
    const percentage = (parking.availableSpots / parking.capacity) * 100;
    if (percentage > 50) return "text-emerald-700";
    if (percentage > 20) return "text-amber-700";
    return "text-rose-700";
  };

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
            <div className="space-y-3">
              {selectedParkings.map((parking) => {
                const parkingRatings = ratings.filter(r => r.parkingId === parking.id);
                const avgRating = parkingRatings.length > 0 
                  ? (parkingRatings.reduce((sum, r) => sum + r.rating, 0) / parkingRatings.length).toFixed(1)
                  : "—";
                const isMapMenuOpen = openMapMenu === parking.id;

                return (
                  <div key={parking.id} className={`p-4 rounded-xl border ${getAvailabilityColor(parking)} transition hover:shadow-md`}>
                    <div className="flex justify-between items-start gap-4">
                      {/* Información del parqueo */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-slate-900 truncate">{parking.name}</h4>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            parking.type === "privado" 
                              ? "bg-blue-100 text-blue-700" 
                              : "bg-emerald-100 text-emerald-700"
                          }`}>
                            {parking.type === "privado" ? "🔒 Privado" : "🔓 Público"}
                          </span>
                        </div>

                        <p className="text-sm text-slate-600 mb-3 truncate">📍 {parking.address}</p>

                        <div className="flex flex-wrap gap-3 items-center text-sm">
                          <div>
                            <span className="font-semibold text-slate-900">₡{parking.ratePerHour}/hr</span>
                          </div>
                          <div className={`font-semibold ${getAvailabilityBadge(parking)}`}>
                            {parking.availableSpots > 0 ? `${parking.availableSpots}/${parking.capacity} disponibles` : "Lleno"}
                          </div>
                          <div className="text-slate-600">
                            ⭐ {avgRating} ({parkingRatings.length})
                          </div>
                        </div>
                      </div>

                      {/* Botones de acción */}
                      <div className="flex flex-col gap-2 whitespace-nowrap relative">
                        <div className="relative">
                          <button
                            onClick={() => setOpenMapMenu(isMapMenuOpen ? null : parking.id)}
                            className="px-3 py-2 rounded-lg bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition"
                            title="Abrir opciones de navegación"
                          >
                            🗺️ Ir
                          </button>

                          {isMapMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-10 overflow-hidden">
                              <button
                                onClick={() => handleOpenGoogleMaps(parking)}
                                className="w-full px-4 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-blue-50 transition flex items-center gap-2"
                              >
                                <span>🗺️</span>
                                <span>Google Maps</span>
                              </button>
                              <button
                                onClick={() => handleOpenWaze(parking)}
                                className="w-full px-4 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-purple-50 transition flex items-center gap-2 border-t border-slate-200"
                              >
                                <span>🧭</span>
                                <span>Waze</span>
                              </button>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => onShowRatingModal(parking)}
                          className="px-3 py-2 rounded-lg bg-blue-100 text-blue-700 text-sm font-semibold hover:bg-blue-200 transition"
                        >
                          ⭐ Ver
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
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
