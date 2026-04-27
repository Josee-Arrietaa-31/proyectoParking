import { ZONES } from "../utils/geolocation";

function ZoneSelector({ selectedZone, onZoneChange, parkingCount = 0 }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-3">
          Selecciona una zona
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:flex-wrap">
          {ZONES.map((zone) => (
            <button
              key={zone.id}
              onClick={() => onZoneChange(zone.id)}
              className={`px-4 py-3 rounded-2xl text-sm font-semibold transition transform ${
                selectedZone === zone.id
                  ? `bg-${zone.color}-600 text-white shadow-lg scale-105`
                  : `bg-white/60 text-slate-700 border border-white/40 hover:bg-white/80`
              }`}
            >
              {zone.name}
            </button>
          ))}
        </div>
      </div>

      {selectedZone && (
        <div className="rounded-2xl bg-blue-50 border border-blue-200 p-4">
          <p className="text-sm text-blue-700">
            📍 Se encontraron <strong>{parkingCount}</strong> parqueo{parkingCount !== 1 ? "s" : ""} en esta zona
          </p>
        </div>
      )}
    </div>
  );
}

export default ZoneSelector;
