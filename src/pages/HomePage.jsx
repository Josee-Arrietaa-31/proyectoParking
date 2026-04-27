import AuthPanel from "../components/AuthPanel";
import GuestOverview from "../components/GuestOverview";
import HeroSection from "../components/HeroSection";

function HomePage({
  users,
  parkings,
  payments,
  summary,
  formatCurrency,
  loginForm,
  registerForm,
  onLoginChange,
  onRegisterChange,
  onLoginSubmit,
  onRegisterSubmit,
  currentUser
}) {
  return (
    <>
      <HeroSection usersCount={users.length} parkingsCount={parkings.length} paymentsCount={payments.length} />

      <main className="mt-8 grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <AuthPanel
          users={users}
          loginForm={loginForm}
          registerForm={registerForm}
          onLoginChange={onLoginChange}
          onRegisterChange={onRegisterChange}
          onLoginSubmit={onLoginSubmit}
          onRegisterSubmit={onRegisterSubmit}
        />

        <section className="rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_30px_100px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="border-b border-slate-200 pb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">Inicio</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">Estado del prototipo</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {currentUser
                ? `Ya tienes una sesion activa como ${currentUser.role}. Puedes volver a entrar o navegar a tu panel.`
                : "La app ya tiene autenticacion, vistas por rol y una API local. Desde aqui seguimos ordenando el MVP."}
            </p>
          </div>

          <GuestOverview summary={summary} formatCurrency={formatCurrency} />
        </section>
      </main>
    </>
  );
}

        <section className="rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_30px_100px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="border-b border-slate-200 pb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">Inicio</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">Estado del prototipo</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {currentUser
                ? `Ya tienes una sesion activa como ${currentUser.role}. Puedes volver a entrar o navegar a tu panel.`
                : "La app ya tiene autenticacion, vistas por rol y una API local. Desde aqui seguimos ordenando el MVP."}
            </p>
          </div>

          <GuestOverview summary={summary} formatCurrency={formatCurrency} />
        </section>
      </main>
    </>
  );
}

export default HomePage;
