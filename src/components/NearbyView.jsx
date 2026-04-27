import { useState, useEffect } from "react";
import { calculateDistance, getUserLocation } from "../utils/geolocation";
import ParkingCard from "./ParkingCard";

function NearbyView({ parkings, ratings, formatCurrency, onPayParking, onShowRatingModal }) {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [radius, setRadius] = useState(5); // km

  const nearbyParkings = userLocation
    ? parkings
        .map((parking) => ({
          ...parking,
          distance: calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            parking.latitude,
            parking.longitude
          )
        }))
        .filter((parking) => parking.distance <= radius)
        .sort((a, b) => a.distance - b.distance)
    : [];

  const handleGetLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const location = await getUserLocation();
      setUserLocation(location);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[30px] border border-white/40 bg-slate-950 p-5 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-300">Ubicación actual</p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight">Parqueos cercanos</h3>
        <p className="mt-2 text-sm text-slate-400">Encuentra parqueos cerca de tu ubicación</p>

        {!userLocation ? (
          <button
            onClick={handleGetLocation}
            disabled={loading}
            className="mt-6 w-full rounded-2xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50"
          >
            {loading ? "Obteniendo ubicación..." : "📍 Usar mi ubicación"}
          </button>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-slate-800/50 p-4 border border-slate-700">
              <p className="text-xs text-slate-400 mb-2">Tu ubicación</p>
              <p className="text-sm font-mono text-orange-400">
                {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                Radio de búsqueda: {radius}km
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>1km</span>
                <span>20km</span>
              </div>
            </div>

            <button
              onClick={handleGetLocation}
              className="w-full rounded-2xl bg-slate-700 px-6 py-2 text-sm font-semibold text-white transition hover:bg-slate-600"
            >
              🔄 Actualizar ubicación
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-[24px] border border-red-200 bg-red-50 p-5">
          <p className="text-sm text-red-700">⚠️ {error}</p>
        </div>
      )}

      {userLocation && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Parqueos cercanos ({nearbyParkings.length})
          </h3>

          {nearbyParkings.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {nearbyParkings.map((parking) => (
                <div key={parking.id} className="space-y-3">
                  <div className="absolute top-4 right-4 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {parking.distance.toFixed(1)} km
                  </div>
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
              <p className="text-slate-600 font-medium">No hay parqueos en ese radio</p>
              <p className="text-sm text-slate-500 mt-1">Intenta aumentar el radio de búsqueda</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NearbyView;
