import ParkingCard from "./ParkingCard";

function FavoritesView({ parkings, ratings, formatCurrency, favorites, onToggleFavorite, onPayParking, onShowRatingModal }) {
  const favoriteParkings = parkings.filter((p) => favorites.includes(p.id));

  if (favoriteParkings.length === 0) {
    return (
      <div className="rounded-[28px] border border-white/40 bg-white/80 p-12 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-700 dark:bg-slate-800/80">
        <p className="text-5xl mb-4">❤️</p>
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Sin favoritos</h3>
        <p className="text-slate-600 dark:text-slate-400">
          Agrega parqueos a favoritos para acceder rápidamente. Haz clic en el corazón 🤍 en cualquier parqueo.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[28px] border border-white/40 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-700 dark:bg-slate-800/80">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-600 dark:text-red-400">Mis Favoritos</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {favoriteParkings.length} Parqueo{favoriteParkings.length !== 1 ? "s" : ""} Guardado{favoriteParkings.length !== 1 ? "s" : ""}
        </h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Acceso rápido a tus parqueos favoritos</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {favoriteParkings.map((parking) => (
          <ParkingCard
            key={parking.id}
            parking={parking}
            formatCurrency={formatCurrency}
            ratings={ratings}
            isFavorite={true}
            onToggleFavorite={onToggleFavorite}
            action={
              <div className="flex gap-2">
                <button
                  onClick={() => onPayParking(parking.id)}
                  className="flex-1 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  💳 Pagar
                </button>
                <button
                  onClick={() => onShowRatingModal(parking)}
                  className="flex-1 rounded-lg bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-200 transition dark:bg-amber-900/40 dark:text-amber-300 dark:hover:bg-amber-900/60"
                >
                  ⭐ Calificar
                </button>
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
}

export default FavoritesView;
