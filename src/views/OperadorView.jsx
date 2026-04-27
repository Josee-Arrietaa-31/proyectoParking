import ParkingCard from "../components/ParkingCard";

const inputClass =
  "w-full rounded-2xl border border-white/20 bg-white/70 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-200";

function OperadorView({ parkingForm, myParkings, formatCurrency, onParkingChange, onParkingSubmit, onUpdateAvailability }) {
  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <form onSubmit={onParkingSubmit} className="rounded-[30px] border border-white/40 bg-slate-950 p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">Gestion operativa</p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight">Registrar parqueo</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-200">Nombre</span>
            <input className={inputClass} type="text" value={parkingForm.name} onChange={(event) => onParkingChange("name", event.target.value)} required />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Tipo</span>
            <select className={inputClass} value={parkingForm.type} onChange={(event) => onParkingChange("type", event.target.value)}>
              <option value="privado">Privado</option>
              <option value="publico">Publico</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Tarifa por hora</span>
            <input className={inputClass} type="number" min="1" value={parkingForm.ratePerHour} onChange={(event) => onParkingChange("ratePerHour", event.target.value)} required />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Latitud</span>
            <input className={inputClass} type="number" step="0.0001" value={parkingForm.latitude} onChange={(event) => onParkingChange("latitude", event.target.value)} required />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Longitud</span>
            <input className={inputClass} type="number" step="0.0001" value={parkingForm.longitude} onChange={(event) => onParkingChange("longitude", event.target.value)} required />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Capacidad</span>
            <input className={inputClass} type="number" min="1" value={parkingForm.capacity} onChange={(event) => onParkingChange("capacity", event.target.value)} required />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Disponibles</span>
            <input className={inputClass} type="number" min="0" value={parkingForm.availableSpots} onChange={(event) => onParkingChange("availableSpots", event.target.value)} required />
          </label>
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
