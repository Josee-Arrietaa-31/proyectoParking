// Componente para mostrar y seleccionar estrellas (1-5)

function RatingStars({ rating, onRatingChange, interactive = false, size = "md" }) {
  const sizeClass = {
    sm: "text-sm",
    md: "text-xl",
    lg: "text-3xl"
  }[size];

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => interactive && onRatingChange?.(star)}
          className={`${sizeClass} transition ${
            star <= rating ? "text-yellow-400" : "text-slate-300"
          } ${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
          disabled={!interactive}
          type="button"
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default RatingStars;
