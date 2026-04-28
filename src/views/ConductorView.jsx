import { useState } from "react";
import ParkingCard from "../components/ParkingCard";
import ParkingMap from "../components/ParkingMap";
import SearchFilters from "../components/SearchFilters";
import TransactionHistory from "../components/TransactionHistory";
import ParkingRatings from "../components/ParkingRatings";
import RatingForm from "../components/RatingForm";
import ZoneView from "../components/ZoneView";
import NearbyView from "../components/NearbyView";
import FavoritesView from "../components/FavoritesView";
import useFavorites from "../hooks/useFavorites";

function ConductorView({ parkings, payments, ratings, users, currentUser, formatCurrency, onPayParking, onSubmitRating }) {
  const [filteredParkings, setFilteredParkings] = useState(parkings);
  const [selectedParking, setSelectedParking] = useState(null);
  const [activeTab, setActiveTab] = useState("search");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const getUserPaymentForParking = (parkingId) => {
    return payments.find(p => p.conductorId === currentUser.id && p.parkingId === parkingId);
  };

  const getUserRatingForParking = (parkingId) => {
    return ratings.find(r => r.conductorId === currentUser.id && r.parkingId === parkingId);
  };

  const handleShowRatingModal = (parking) => {
    setSelectedParking(parking);
    setShowRatingModal(true);
  };

  return (
    <div className="mt-6 space-y-6">
      {/* Tabs de navegación */}
      <div className="flex gap-2 border-b border-white/20 overflow-x-auto">
        <button
          onClick={() => setActiveTab("search")}
          className={`px-6 py-3 font-semibold transition whitespace-nowrap ${
            activeTab === "search"
              ? "border-b-2 border-emerald-500 text-emerald-600"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          🔍 Mapa
        </button>
        <button
          onClick={() => setActiveTab("zones")}
          className={`px-6 py-3 font-semibold transition whitespace-nowrap ${
            activeTab === "zones"
              ? "border-b-2 border-emerald-500 text-emerald-600"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          📍 Por Zona
        </button>
        <button
          onClick={() => setActiveTab("nearby")}
          className={`px-6 py-3 font-semibold transition whitespace-nowrap ${
            activeTab === "nearby"
              ? "border-b-2 border-emerald-500 text-emerald-600"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          📡 Cercanos
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-6 py-3 font-semibold transition whitespace-nowrap ${
            activeTab === "history"
              ? "border-b-2 border-emerald-500 text-emerald-600"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          📜 Mi historial ({payments.filter(p => p.conductorId === currentUser.id).length})
        </button>
        <button
          onClick={() => setActiveTab("favorites")}
          className={`px-6 py-3 font-semibold transition whitespace-nowrap ${
            activeTab === "favorites"
              ? "border-b-2 border-emerald-500 text-emerald-600"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          ❤️ Favoritos ({favorites.length})
        </button>
      </div>

      {/* Modal de detalles del parqueo - Global para todos los tabs */}
      {selectedParking && showRatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[32px] border border-white/40 bg-white/95 p-8 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">{selectedParking.name}</h2>
              <button
                onClick={() => setShowRatingModal(false)}
                className="text-2xl text-slate-400 hover:text-slate-600 transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Calificaciones */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Calificaciones de usuarios</h3>
                <ParkingRatings
                  ratings={ratings.filter(r => r.parkingId === selectedParking.id)}
                  users={users}
                />
              </div>

              {/* Formulario de calificación */}
              {getUserPaymentForParking(selectedParking.id) && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">
                    {getUserRatingForParking(selectedParking.id) ? "Actualizar tu calificación" : "Califica tu experiencia"}
                  </h3>
                  <RatingForm
                    parkingId={selectedParking.id}
                    onSubmitRating={(ratingData) => {
                      onSubmitRating(selectedParking.id, ratingData);
                      setShowRatingModal(false);
                    }}
                    existingRating={getUserRatingForParking(selectedParking.id)}
                  />
                </div>
              )}

              {!getUserPaymentForParking(selectedParking.id) && (
                <div className="rounded-[24px] border border-blue-200 bg-blue-50 p-5 text-center">
                  <p className="text-sm text-blue-700">
                    💡 Necesitas haber pagado en este parqueo para poder calificarlo
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Buscar parqueos (Mapa) */}
      {activeTab === "search" && (
        <div className="space-y-6">

          <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            {/* Mapa y filtros */}
            <div className="space-y-5">
              <div className="overflow-hidden rounded-[30px] border border-white/40 bg-slate-950 p-5 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">Busqueda cercana</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight">Mapa interactivo</h3>
                <div className="mt-5">
                  <ParkingMap 
                    parkings={filteredParkings} 
                    onSelectParking={setSelectedParking}
                    selectedParking={selectedParking}
                  />
                </div>
              </div>
            </div>

            {/* Panel de filtros */}
            <div>
              <SearchFilters 
                parkings={parkings}
                onFiltersChange={setFilteredParkings}
              />
            </div>
          </div>

          {/* Listado de parqueos filtrados */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Parqueos disponibles ({filteredParkings.length})
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredParkings.map((parking) => (
                <div key={parking.id} className="space-y-3">
                  <ParkingCard
                    parking={parking}
                    formatCurrency={formatCurrency}
                    ratings={ratings}
                    action={
                      <div className="flex flex-col gap-2">
                        <button
                          className="inline-flex rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 w-full justify-center"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPayParking(parking.id);
                          }}
                        >
                          Pagar 1 hora
                        </button>
                        <button
                          className="inline-flex rounded-2xl bg-blue-100 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-200 w-full justify-center"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShowRatingModal(parking);
                          }}
                        >
                          ⭐ Ver calificaciones
                        </button>
                      </div>
                    }
                  />
                </div>
              ))}
            </div>
            {filteredParkings.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-600 font-medium">No hay parqueos que coincidan con los filtros</p>
                <p className="text-sm text-slate-500 mt-1">Intenta ajustar los criterios de búsqueda</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Por Zona */}
      {activeTab === "zones" && (
        <ZoneView
          parkings={parkings}
          ratings={ratings}
          formatCurrency={formatCurrency}
          onPayParking={onPayParking}
          onShowRatingModal={handleShowRatingModal}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      )}

      {/* Tab: Cercanos */}
      {activeTab === "nearby" && (
        <NearbyView
          parkings={parkings}
          ratings={ratings}
          formatCurrency={formatCurrency}
          onPayParking={onPayParking}
          onShowRatingModal={handleShowRatingModal}
        />
      )}

      {/* Tab: Historial de transacciones */}
      {activeTab === "history" && (
        <TransactionHistory
          payments={payments}
          parkings={parkings}
          currentUser={currentUser}
          formatCurrency={formatCurrency}
        />
      )}

      {/* Tab: Favoritos */}
      {activeTab === "favorites" && (
        <FavoritesView
          parkings={parkings}
          ratings={ratings}
          formatCurrency={formatCurrency}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onPayParking={onPayParking}
          onShowRatingModal={handleShowRatingModal}
        />
      )}
    </div>
  );
}

export default ConductorView;
