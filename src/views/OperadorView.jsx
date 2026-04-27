import { useState } from "react";
import FormField from "../components/FormField";
import { validators } from "../utils/validators";
import ParkingCard from "../components/ParkingCard";

function OperadorView({ parkingForm, myParkings, formatCurrency, onParkingChange, onParkingSubmit, onUpdateAvailability }) {
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    onParkingChange(field, value);
    // Limpiar error al escribir
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validateAndSubmit = (event) => {
    event.preventDefault();

    const newErrors = {};

    // Validar nombre
    const nameError = validators.parkingName(parkingForm.name);
    if (nameError) newErrors.name = nameError;

    // Validar capacidad
    const capacityError = validators.capacity(parkingForm.capacity);
    if (capacityError) newErrors.capacity = capacityError;

    // Validar espacios disponibles
    const spotsError = validators.availableSpots(parkingForm.availableSpots, parkingForm.capacity);
    if (spotsError) newErrors.availableSpots = spotsError;

    // Validar tarifa
    const priceError = validators.price(parkingForm.ratePerHour);
    if (priceError) newErrors.ratePerHour = priceError;

    // Validar latitud
    const latError = validators.latitude(parkingForm.latitude);
    if (latError) newErrors.latitude = latError;

    // Validar longitud
    const lngError = validators.longitude(parkingForm.longitude);
    if (lngError) newErrors.longitude = lngError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onParkingSubmit(event);
  };

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
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

      <div className="grid gap-5">
        {myParkings.length ? (
          myParkings.map((parking) => (
            <ParkingCard
              key={parking.id}
              parking={parking}
              formatCurrency={formatCurrency}
              action={
                <div className="flex flex-wrap gap-3">
                  <button
                    className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    type="button"
                    onClick={() => onUpdateAvailability(parking.id, Math.max(parking.availableSpots - 1, 0))}
                  >
                    -1 disponible
                  </button>
                  <button
                    className="rounded-2xl bg-emerald-100 px-4 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-200"
                    type="button"
                    onClick={() => onUpdateAvailability(parking.id, Math.min(parking.availableSpots + 1, parking.capacity))}
                  >
                    +1 disponible
                  </button>
                </div>
              }
            />
          ))
        ) : (
          <div className="rounded-[30px] border border-dashed border-slate-300 bg-slate-50/80 p-8 text-center text-slate-600">
            Aun no has registrado parqueos.
          </div>
        )}
      </div>
    </div>
  );
}

export default OperadorView;
