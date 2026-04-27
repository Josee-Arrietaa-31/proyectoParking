import { useState } from "react";
import FormField from "./FormField";
import { validators, isEmailUnique, validateForm } from "../utils/validators";

function AuthPanel({
  loginForm,
  registerForm,
  onLoginChange,
  onRegisterChange,
  onLoginSubmit,
  onRegisterSubmit,
  users = []
}) {
  const [loginErrors, setLoginErrors] = useState({});
  const [registerErrors, setRegisterErrors] = useState({});

  const handleLoginChange = (field, value) => {
    onLoginChange(field, value);
    // Limpiar error cuando el usuario empieza a escribir
    setLoginErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleRegisterChange = (field, value) => {
    onRegisterChange(field, value);
    // Limpiar error cuando el usuario empieza a escribir
    setRegisterErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validateAndSubmitLogin = (event) => {
    event.preventDefault();
    
    const errors = {};
    if (!loginForm.email) errors.email = "El correo es requerido";
    else if (!validators.email(loginForm.email)) {
      // Email es válido
    } else {
      errors.email = validators.email(loginForm.email);
    }
    
    if (!loginForm.password) errors.password = "La contraseña es requerida";

    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
      return;
    }

    setLoginErrors({});
    onLoginSubmit(event);
  };

  const validateAndSubmitRegister = (event) => {
    event.preventDefault();

    const errors = {};

    // Validar nombre
    const nameError = validators.name(registerForm.name);
    if (nameError) errors.name = nameError;

    // Validar email
    const emailError = validators.email(registerForm.email);
    if (emailError) {
      errors.email = emailError;
    } else if (!isEmailUnique(registerForm.email, users)) {
      errors.email = "Este correo ya está registrado";
    }

    // Validar contraseña
    const passwordError = validators.password(registerForm.password);
    if (passwordError) errors.password = passwordError;

    if (Object.keys(errors).length > 0) {
      setRegisterErrors(errors);
      return;
    }

    setRegisterErrors({});
    onRegisterSubmit(event);
  };

  return (
    <section className="rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_30px_100px_rgba(15,23,42,0.08)] backdrop-blur">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">Acceso</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">Entrar o registrarse</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Prueba los flujos del prototipo con los roles del sistema.</p>
      </div>

      <div className="mt-6 space-y-5">
        <form onSubmit={validateAndSubmitLogin} className="rounded-[28px] border border-slate-200/80 bg-slate-50/80 p-5">
          <h3 className="text-lg font-semibold text-slate-900">Iniciar sesion</h3>
          <div className="mt-4 space-y-4">
            <FormField
              label="Correo"
              type="email"
              value={loginForm.email}
              onChange={(value) => handleLoginChange("email", value)}
              error={loginErrors.email}
              placeholder="conductor@demo.com"
            />
            <FormField
              label="Contraseña"
              type="password"
              value={loginForm.password}
              onChange={(value) => handleLoginChange("password", value)}
              error={loginErrors.password}
              placeholder="••••••••"
            />
          </div>
          <button className="mt-5 inline-flex w-full justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700" type="submit">
            Entrar al sistema
          </button>
        </form>

        <form onSubmit={validateAndSubmitRegister} className="rounded-[28px] border border-slate-200/80 bg-slate-50/80 p-5">
          <h3 className="text-lg font-semibold text-slate-900">Registrar usuario</h3>
          <div className="mt-4 space-y-4">
            <FormField
              label="Nombre"
              type="text"
              value={registerForm.name}
              onChange={(value) => handleRegisterChange("name", value)}
              error={registerErrors.name}
              placeholder="Tu nombre completo"
            />
            <FormField
              label="Correo"
              type="email"
              value={registerForm.email}
              onChange={(value) => handleRegisterChange("email", value)}
              error={registerErrors.email}
              placeholder="tu@correo.com"
            />
            <FormField
              label="Contraseña"
              type="password"
              value={registerForm.password}
              onChange={(value) => handleRegisterChange("password", value)}
              error={registerErrors.password}
              placeholder="Mínimo 4 caracteres"
            />
            <FormField
              label="Rol"
              value={registerForm.role}
              onChange={(value) => handleRegisterChange("role", value)}
              options={[
                { label: "Conductor", value: "conductor" },
                { label: "Operador", value: "operador" },
                { label: "Municipalidad", value: "municipalidad" }
              ]}
            />
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
