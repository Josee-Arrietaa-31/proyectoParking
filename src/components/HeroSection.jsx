import { demoUsers } from "../constants/appData";
import StatCard from "./StatCard";

function HeroSection({ usersCount, parkingsCount, paymentsCount }) {
  return (
    <header className="relative overflow-hidden rounded-[36px] border border-white/50 bg-slate-950 px-6 py-8 text-white shadow-[0_30px_120px_rgba(15,23,42,0.35)] sm:px-8 lg:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,_rgba(16,185,129,0.30),_transparent_20%),radial-gradient(circle_at_90%_20%,_rgba(250,204,21,0.18),_transparent_18%),linear-gradient(135deg,_rgba(15,23,42,0.1),_rgba(15,23,42,0.85))]" />
      <div className="relative grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-300">Sprint 3 · React + Tailwind</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Plataforma integrada para gestionar parqueos urbanos
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Un MVP para conductores, operadores y municipalidades con autenticacion, consulta visual, disponibilidad y pagos basicos.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <StatCard label="Usuarios" value={usersCount} accent="text-emerald-300" />
            <StatCard label="Parqueos" value={parkingsCount} accent="text-amber-300" />
            <StatCard label="Pagos" value={paymentsCount} accent="text-cyan-300" />
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/8 p-6 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-300">Accesos demo</p>
          <div className="mt-5 space-y-4">
            {demoUsers.map((user) => (
              <div key={user.email} className="rounded-2xl border border-white/10 bg-white/8 p-4">
                <p className="text-sm font-semibold text-white">{user.role}</p>
                <p className="mt-1 text-sm text-slate-300">{user.email}</p>
                <p className="text-sm text-emerald-300">Clave: {user.password}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

export default HeroSection;
