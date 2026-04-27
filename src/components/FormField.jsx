// Componente reutilizable para campos de formulario con validación

function FormField({
  label,
  type = "text",
  value,
  onChange,
  error,
  required = true,
  placeholder = "",
  options = null,
  min,
  max,
  step,
  disabled = false
}) {
  const inputClass =
    "w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 " +
    (error
      ? "border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-4 focus:ring-red-200"
      : "border-white/20 bg-white/70 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-200");

  return (
    <div className="block">
      <label className="block">
        <span className="mb-2 flex items-center gap-1">
          <span className="text-sm font-medium text-slate-700">{label}</span>
          {required && <span className="text-red-500">*</span>}
        </span>

        {options ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={inputClass}
          >
            <option value="">Selecciona una opción</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            className={inputClass}
          />
        )}
      </label>

      {error && (
        <div className="mt-2 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
          <span className="mt-0.5 text-sm leading-5 text-red-700">⚠ {error}</span>
        </div>
      )}
    </div>
  );
}

export default FormField;
