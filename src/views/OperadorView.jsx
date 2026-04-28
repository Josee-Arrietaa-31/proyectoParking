import { useState } from "react";
import FormField from "../components/FormField";
import { validators } from "../utils/validators";
import ParkingCard from "../components/ParkingCard";
import StatCard from "../components/StatCard";

function OperadorView({ parkingForm, myParkings, formatCurrency, onParkingChange, onParkingSubmit, onUpdateAvailability }) {
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    onParkingChange(field, value);
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validateAndSubmit = (event) => {
    event.preventDefault();

    const newErrors = {};

    const nameError = validators.parkingName(parkingForm.name);
    if (nameError) newErrors.name = nameError;

    const capacityError = validators.capacity(parkingForm.capacity);
    if (capacityError) newErrors.capacity = capacityError;

    const spotsError = validators.availableSpots(parkingForm.availableSpots, parkingForm.capacity);
    if (spotsError) newErrors.availableSpots = spotsError;

    const priceError = validators.price(parkingForm.ratePerHour);
    if (priceError) newErrors.ratePerHour = priceError;

    const latError = validators.latitude(parkingForm.latitude);
    if (latError) newErrors.latitude = latError;

    const lngError = validators.longitude(parkingForm.longitude);
    if (lngError) newErrors.longitude = lngError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onParkingSubmit(event);
  };

  // Calcular estadísticas de los parqueos del operador
  const operatorStats = myParkings.reduce((acc, parking) => {
    return {
      totalParkings: acc.totalParkings + 1,
      totalCapacity: acc.totalCapacity + parking.capacity,
      occupied: acc.occupied + (parking.capacity - parking.availableSpots),
      available: acc.available + parking.availableSpots,
      totalRate: acc.totalRate + parking.ratePerHour
    };
  }, { totalParkings: 0, totalCapacity: 0, occupied: 0, available: 0, totalRate: 0 });

  const avgOccupancy = operatorStats.totalCapacity > 0 
    ? Math.round(((operatorStats.occupied) / operatorStats.totalCapacity) * 100) 
    : 0;

  const avgRate = operatorStats.totalParkings > 0 
    ? Math.round(operatorStats.totalRate / operatorStats.totalParkings)
    : 0;

  // Top parqueos por ocupación
  const topOccupied = [...myParkings]
    .map(p => ({
      ...p,
      occupancyRate: p.capacity > 0 ? Math.round(((p.capacity - p.availableSpots) / p.capacity) * 100) : 0
    }))
    .sort((a, b) => b.occupancyRate - a.occupancyRate);

  return (
    <div className="mt-6 space-y-8">
      {/* Estadísticas del operador */}
      {myParkings.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">📈 Tu desempeño</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Parqueos" value={operatorStats.totalParkings} accent="text-slate-900" />
            <StatCard label="Capacidad" value={operatorStats.totalCapacity} accent="text-cyan-700" />
            <StatCard label="Ocupación" value={`${avgOccupancy}%`} accent="text-amber-700" />
            <StatCard label="Tarifa promedio" value={`₡${avgRate}/hr`} accent="text-emerald-700" />
          </div>

          {/* Desglose visual de ocupación */}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-4">Ocupación total</h4>
              <div className="mb-4">
                <div className="w-full bg-slate-200 rounded-full h-4 mb-2">
                  <div 
                    className={`h-4 rounded-full transition-all ${
                      avgOccupancy >= 80 ? 'bg-rose-500' :
                      avgOccupancy >= 50 ? 'bg-amber-500' :
                      'bg-emerald-500'
                    }`}
                    style={{ width: `${avgOccupancy}%` }}
                  />
                </div>
                <p className="text-sm text-slate-600">
                  {operatorStats.occupied}/{operatorStats.totalCapacity} espacios ocupados
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-emerald-50 rounded p-3">
                  <p className="text-emerald-700 font-bold text-lg">{operatorStats.available}</p>
                  <p className="text-emerald-600 text-xs">Disponibles</p>
                </div>
                <div className="bg-amber-50 rounded p-3">
                  <p className="text-amber-700 font-bold text-lg">{operatorStats.occupied}</p>
                  <p className="text-amber-600 text-xs">Ocupados</p>
                </div>
              </div>
            </div>

            {/* Tabla de rendimiento por parqueo */}
            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-4">🎯 Rendimiento por parqueo</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {topOccupied.map((parking) => (
                  <div key={parking.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{parking.name}</p>
                      <div className="mt-1 w-12 bg-slate-300 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
                            parking.occupancyRate >= 80 ? 'bg-rose-500' :
                            parking.occupancyRate >= 50 ? 'bg-amber-500' :
                            'bg-emerald-500'
                          }`}
                          style={{ width: `${parking.occupancyRate}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right ml-2">
                      <p className="text-sm font-bold text-slate-900">{parking.occupancyRate}%</p>
                      <p className="text-xs text-slate-500">{parking.availableSpots}/{parking.capacity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabla detallada */}
          <div className="mt-6 bg-white rounded-lg overflow-hidden border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 font-semibold text-slate-900">Parqueo</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-900">Tipo</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-900">Tarifa</th>
                    <th className="text-center px-4 py-3 font-semibold text-slate-900">Ocupación</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-900">Espacios</th>
                  </tr>
                </thead>
                <tbody>
                  {topOccupied.map((parking) => (
                    <tr key={parking.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{parking.name}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                          parking.type === 'privado' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {parking.type === 'privado' ? '🔒 Privado' : '🔓 Público'}
                        </span>
                      </td>
                      <td className="text-right px-4 py-3 font-semibold text-emerald-700">₡{parking.ratePerHour}/hr</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <div className={`w-16 bg-slate-200 rounded-full h-2 ${
                            parking.occupancyRate >= 80 ? 'bg-rose-200' :
                            parking.occupancyRate >= 50 ? 'bg-amber-200' :
                            'bg-emerald-200'
                          }`}>
                            <div 
                              className={`h-2 rounded-full ${
                                parking.occupancyRate >= 80 ? 'bg-rose-500' :
                                parking.occupancyRate >= 50 ? 'bg-amber-500' :
                                'bg-emerald-500'
                              }`}
                              style={{ width: `${parking.occupancyRate}%` }}
                            />
                          </div>
                          <span className="font-semibold text-slate-900 min-w-max">{parking.occupancyRate}%</span>
                        </div>
                      </td>
                      <td className="text-right px-4 py-3 font-medium text-slate-900">
                        {parking.availableSpots}/{parking.capacity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Formulario y parqueos */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        {/* Formulario */}
        <form onSubmit={validateAndSubmit} className="rounded-[30px] border border-white/40 bg-slate-950 p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">Gestion operativa</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight">Registrar parqueo</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FormField
                label="Nombre del parqueo"
                type="text"
                value={parkingForm.name}
                onChange={(value) => handleChange("name", value)}
                error={errors.name}
                placeholder="Ej: Parqueo Centro"
              />
            </div>

            <div>
              <label className="block">
                <span className="mb-2 flex items-center gap-1">
                  <span className="text-sm font-medium text-slate-200">Tipo</span>
                  <span className="text-red-400">*</span>
                </span>
                <select
                  value={parkingForm.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-200"
                >
                  <option value="privado">Privado</option>
                  <option value="publico">Público</option>
                </select>
              </label>
            </div>

            <FormField
              label="Tarifa por hora (₡)"
              type="number"
              min="1"
              value={parkingForm.ratePerHour}
              onChange={(value) => handleChange("ratePerHour", value)}
              error={errors.ratePerHour}
              placeholder="800"
            />

            <FormField
              label="Latitud"
              type="number"
              step="0.0001"
              value={parkingForm.latitude}
              onChange={(value) => handleChange("latitude", value)}
              error={errors.latitude}
              placeholder="10.3625"
            />

            <FormField
              label="Longitud"
              type="number"
              step="0.0001"
              value={parkingForm.longitude}
              onChange={(value) => handleChange("longitude", value)}
              error={errors.longitude}
              placeholder="-84.4789"
            />

            <FormField
              label="Capacidad total"
              type="number"
              min="1"
              value={parkingForm.capacity}
              onChange={(value) => handleChange("capacity", value)}
              error={errors.capacity}
              placeholder="20"
            />

            <FormField
              label="Espacios disponibles"
              type="number"
              min="0"
              value={parkingForm.availableSpots}
              onChange={(value) => handleChange("availableSpots", value)}
              error={errors.availableSpots}
              placeholder="15"
            />
          </div>

          <button className="mt-5 inline-flex w-full justify-center rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400" type="submit">
            Guardar parqueo
          </button>
        </form>

        {/* Tarjetas de parqueos */}
        <div className="space-y-4">
          {myParkings.length ? (
            myParkings.map((parking) => (
              <ParkingCard
                key={parking.id}
                parking={parking}
                formatCurrency={formatCurrency}
                action={
                  <div className="flex flex-wrap gap-2 text-xs">
                    <button
                      className="rounded-xl bg-slate-950 px-3 py-2 font-semibold text-white transition hover:bg-slate-800"
                      type="button"
                      onClick={() => onUpdateAvailability(parking.id, Math.max(parking.availableSpots - 1, 0))}
                      disabled={parking.availableSpots <= 0}
                    >
                      -1
                    </button>
                    <button
                      className="rounded-xl bg-emerald-100 px-3 py-2 font-semibold text-emerald-800 transition hover:bg-emerald-200"
                      type="button"
                      onClick={() => onUpdateAvailability(parking.id, Math.min(parking.availableSpots + 1, parking.capacity))}
                      disabled={parking.availableSpots >= parking.capacity}
                    >
                      +1
                    </button>
                  </div>
                }
              />
            ))
          ) : (
            <div className="rounded-[30px] border border-dashed border-slate-300 bg-slate-50/80 p-8 text-center text-slate-600">
              <p className="font-medium">Aun no has registrado parqueos.</p>
              <p className="text-xs mt-1">Completa el formulario para crear tu primer parqueo.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OperadorView;
