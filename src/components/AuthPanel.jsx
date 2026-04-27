const inputClass =
  "w-full rounded-2xl border border-white/20 bg-white/70 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-200";

function AuthPanel({
  loginForm,
  registerForm,
  onLoginChange,
  onRegisterChange,
  onLoginSubmit,
  onRegisterSubmit
}) {
  return (
    <section className="rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_30px_100px_rgba(15,23,42,0.08)] backdrop-blur">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">Acceso</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">Entrar o registrarse</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Prueba los flujos del prototipo con los roles del sistema.</p>
      </div>

      <div className="mt-6 space-y-5">
        <form onSubmit={onLoginSubmit} className="rounded-[28px] border border-slate-200/80 bg-slate-50/80 p-5">
          <h3 className="text-lg font-semibold text-slate-900">Iniciar sesion</h3>
          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Correo</span>
              <input
                className={inputClass}
                type="email"
                value={loginForm.email}
                onChange={(event) => onLoginChange("email", event.target.value)}
                required
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Contrasena</span>
              <input
                className={inputClass}
                type="password"
                value={loginForm.password}
                onChange={(event) => onLoginChange("password", event.target.value)}
                required
              />
            </label>
          </div>
          <button className="mt-5 inline-flex w-full justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700" type="submit">
            Entrar al sistema
          </button>
        </form>

        <form onSubmit={onRegisterSubmit} className="rounded-[28px] border border-slate-200/80 bg-slate-50/80 p-5">
          <h3 className="text-lg font-semibold text-slate-900">Registrar usuario</h3>
          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Nombre</span>
              <input
                className={inputClass}
                type="text"
                value={registerForm.name}
                onChange={(event) => onRegisterChange("name", event.target.value)}
                required
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Correo</span>
              <input
                className={inputClass}
                type="email"
                value={registerForm.email}
                onChange={(event) => onRegisterChange("email", event.target.value)}
                required
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Contrasena</span>
              <input
                className={inputClass}
                type="password"
                value={registerForm.password}
                onChange={(event) => onRegisterChange("password", event.target.value)}
                required
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Rol</span>
              <select
                className={inputClass}
                value={registerForm.role}
                onChange={(event) => onRegisterChange("role", event.target.value)}
              >
                <option value="conductor">Conductor</option>
                <option value="operador">Operador</option>
                <option value="municipalidad">Municipalidad</option>
              </select>
            </label>
          </div>
          <button className="mt-5 inline-flex w-full justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700" type="submit">
            Crear cuenta
          </button>
        </form>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
        💡 <strong>Demo:</strong> Usa conductor@demo.com / 1234 para probar el flujo
      </div>
    </section>
  );
}

export default AuthPanel;
