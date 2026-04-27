import { useState } from "react";
import RatingStars from "./RatingStars";

function RatingForm({ parkingId, onSubmitRating, existingRating }) {
  const [rating, setRating] = useState(existingRating?.rating || 0);
  const [comment, setComment] = useState(existingRating?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitRating({ rating, comment });
      setRating(0);
      setComment("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-5 space-y-4">
      <h4 className="font-semibold text-slate-900">Califica este parqueo</h4>

      {/* Selector de estrellas */}
      <div className="space-y-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700 mb-2 block">
            Tu calificación {rating > 0 && `(${rating}/5)`}
          </span>
          <RatingStars
            rating={rating}
            onRatingChange={setRating}
            interactive={true}
            size="lg"
          />
        </label>
      </div>

      {/* Campo de comentario */}
      <div className="space-y-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700 mb-1 block">
            Comentario (opcional)
          </span>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comparte tu experiencia con otros conductores..."
            maxLength={200}
            className="w-full rounded-2xl border border-white/20 bg-white/70 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-200 resize-none"
            rows="3"
          />
          <p className="text-xs text-slate-500 mt-1">{comment.length}/200 caracteres</p>
        </label>
      </div>

      {/* Botón enviar */}
      <button
        type="submit"
        disabled={rating === 0 || isSubmitting}
        className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Enviando..." : "Enviar calificación"}
      </button>

      {existingRating && (
        <p className="text-xs text-emerald-700 text-center">
          ℹ Ya has calificado este parqueo - puedes actualizar tu calificación
        </p>
      )}
    </form>
  );
}

export default RatingForm;
