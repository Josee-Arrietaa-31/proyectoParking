import RatingStars from "./RatingStars";

function ParkingRatings({ ratings, users }) {
  if (!ratings || ratings.length === 0) {
    return (
      <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50/50 p-6 text-center text-slate-600">
        <p className="text-sm">No hay calificaciones aún para este parqueo</p>
        <p className="text-xs text-slate-500 mt-1">Sé el primero en calificar</p>
      </div>
    );
  }

  const averageRating = (
    ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
  ).toFixed(1);

  const getUserName = (conductorId) => {
    const user = users.find((u) => u.id === conductorId);
    return user ? user.name : "Usuario anónimo";
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="space-y-5">
      {/* Resumen de calificaciones */}
      <div className="rounded-[24px] border border-white/40 bg-white/70 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Calificación promedio
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Basado en <strong>{ratings.length}</strong> calificación{ratings.length === 1 ? "" : "es"}
            </p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-yellow-500">{averageRating}</p>
            <RatingStars rating={Math.round(averageRating)} size="lg" />
          </div>
        </div>

        {/* Distribución de estrellas */}
        <div className="mt-5 space-y-2 border-t border-slate-200 pt-5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratings.filter((r) => r.rating === star).length;
            const percentage = Math.round((count / ratings.length) * 100);
            return (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-700 w-12">
                  {star}★
                </span>
                <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 transition-all"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-xs text-slate-600 w-8 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lista de comentarios */}
      <div className="space-y-3">
        <h4 className="font-semibold text-slate-900">Comentarios recientes</h4>
        {ratings
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
          .map((rating) => (
            <div
              key={rating.id}
              className="rounded-[20px] border border-white/40 bg-white/50 p-4 hover:bg-white/70 transition"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-slate-900">{getUserName(rating.conductorId)}</p>
                  <p className="text-xs text-slate-500">{formatDate(rating.createdAt)}</p>
                </div>
                <RatingStars rating={rating.rating} size="sm" />
              </div>
              {rating.comment && (
                <p className="text-sm text-slate-700 mt-2">{rating.comment}</p>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default ParkingRatings;
