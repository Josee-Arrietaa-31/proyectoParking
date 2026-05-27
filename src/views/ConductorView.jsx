import { useState, useEffect } from "react";
import ParkingCard from "../components/ParkingCard";
import ParkingMap from "../components/ParkingMap";
import SearchFilters from "../components/SearchFilters";
import TransactionHistory from "../components/TransactionHistory";
import ParkingRatings from "../components/ParkingRatings";
import RatingForm from "../components/RatingForm";
import ZoneView from "../components/ZoneView";
import NearbyView from "../components/NearbyView";
import FavoritesView from "../components/FavoritesView";
import ReservationForm from "../components/ReservationForm";
import ReservationsView from "../components/ReservationsView";
import UserProfile from "../components/UserProfile";
import SubscriptionPlans from "../components/SubscriptionPlans";
import VehicleHistory from "../components/VehicleHistory";
import SupportSystem from "../components/SupportSystem";
import Infractions from "../components/Infractions";
import useFavorites from "../hooks/useFavorites";

function ConductorView({ parkings, payments, ratings, users, currentUser, formatCurrency, onPayParking, onSubmitRating, vehicles, subscriptions, userSubscriptions, supportTickets, infractions }) {
  const [filteredParkings, setFilteredParkings] = useState([]);
  const [selectedParking, setSelectedParking] = useState(null);
  const [activeTab, setActiveTab] = useState("search");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [reservationRefresh, setReservationRefresh] = useState(0);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    setFilteredParkings(parkings);
  }, [parkings]);

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
        <button
          onClick={() => setActiveTab("reservations")}
          className={`px-6 py-3 font-semibold transition whitespace-nowrap ${
            activeTab === "reservations"
              ? "border-b-2 border-emerald-500 text-emerald-600"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          📅 Mis reservas
        </button>
        <button
          onClick={() => setActiveTab("account")}
          className={`px-6 py-3 font-semibold transition whitespace-nowrap ${
            activeTab === "account"
              ? "border-b-2 border-emerald-500 text-emerald-600"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          👤 Mi Cuenta
        </button>
      </div>

      {/* Modal de calificaciones */}
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

      {/* Modal de detalles del parqueo */}
      {selectedParking && showDetailsModal && !showRatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[32px] border border-white/40 bg-white/95 p-8 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{selectedParking.name}</h2>
                <p className="text-sm text-slate-600 mt-1">{selectedParking.type === "privado" ? "🔒 Privado" : "🔓 Público"}</p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-2xl text-slate-400 hover:text-slate-600 transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Información básica */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[20px] border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Tarifa por hora</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">{formatCurrency(selectedParking.ratePerHour)}</p>
                </div>
                <div className="rounded-[20px] border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Disponibilidad</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-2">{selectedParking.availableSpots}/{selectedParking.capacity}</p>
                </div>
              </div>

              {/* Ubicación */}
              <div className="rounded-[20px] border border-slate-200 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Ubicación</p>
                <p className="text-sm text-slate-900 mt-2 font-mono">📍 {selectedParking.latitude}, {selectedParking.longitude}</p>
                <p className="text-sm text-slate-600 mt-1">{selectedParking.address}</p>
              </div>

              {/* Amenidades */}
              {selectedParking.amenities && (
                <div className="rounded-[20px] border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">Amenidades</p>
                  <div className="grid gap-2">
                    {selectedParking.amenities.covered && <p className="text-sm text-slate-700">🏛️ Cubierto</p>}
                    {selectedParking.amenities.ev_charging && <p className="text-sm text-slate-700">⚡ Carga EV</p>}
                    {selectedParking.amenities.security && <p className="text-sm text-slate-700">🔒 Seguridad 24/7</p>}
                    {selectedParking.amenities.accessibility && <p className="text-sm text-slate-700">♿ Accesible</p>}
                  </div>
                </div>
              )}

              {/* Calificación promedio */}
              {ratings.filter(r => r.parkingId === selectedParking.id).length > 0 && (
                <div className="rounded-[20px] border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">Calificación promedio</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⭐</span>
                    <span className="text-lg font-bold text-slate-900">
                      {(ratings.filter(r => r.parkingId === selectedParking.id).reduce((sum, r) => sum + r.rating, 0) / ratings.filter(r => r.parkingId === selectedParking.id).length).toFixed(1)}
                    </span>
                    <span className="text-sm text-slate-600">({ratings.filter(r => r.parkingId === selectedParking.id).length} reseñas)</span>
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => {
                    onPayParking(selectedParking.id);
                    setShowDetailsModal(false);
                  }}
                  className="flex-1 rounded-[20px] bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  💰 Pagar 1 hora
                </button>
                <button
                  onClick={() => {
                    setShowRatingModal(true);
                    setShowDetailsModal(false);
                  }}
                  className="flex-1 rounded-[20px] bg-blue-100 px-6 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-200"
                >
                  ⭐ Calificaciones
                </button>
                <button
                  onClick={() => toggleFavorite(selectedParking.id)}
                  className={`rounded-[20px] px-6 py-3 text-2xl transition ${isFavorite(selectedParking.id) ? "text-red-500" : "text-slate-400"}`}
                >
                  {isFavorite(selectedParking.id) ? "❤️" : "🤍"}
                </button>
              </div>
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
                    onClick={() => {
                      setSelectedParking(parking);
                      setShowDetailsModal(true);
                    }}
                    isFavorite={isFavorite(parking.id)}
                    onToggleFavorite={toggleFavorite}
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

      {/* Tab: Reservas */}
      {activeTab === "reservations" && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            {/* Panel de reservas activas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Tus reservas</h3>
              <ReservationsView 
                conductorId={currentUser.id}
                refresh={reservationRefresh}
              />
            </div>

            {/* Panel para crear nuevas reservas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Crear nueva reserva</h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {parkings.map((parking) => (
                  <ReservationForm
                    key={parking.id}
                    parking={parking}
                    conductorId={currentUser.id}
                    onReservationCreated={() => setReservationRefresh(prev => prev + 1)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Mi Cuenta */}
      {activeTab === "account" && (
        <div className="space-y-6">
          {/* Sub-tabs de cuenta */}
          <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
            {[
              { id: "profile", label: "👤 Perfil", icon: "👤" },
              { id: "subscription", label: "💳 Membresía", icon: "💳" },
              { id: "vehicles", label: "🚗 Vehículos", icon: "🚗" },
              { id: "support", label: "📞 Soporte", icon: "📞" },
              { id: "infractions", label: "⚠️ Infracciones", icon: "⚠️" }
            ].map((subtab) => (
              <button
                key={subtab.id}
                onClick={() => setActiveTab(`account-${subtab.id}`)}
                className={`px-6 py-3 font-semibold transition whitespace-nowrap text-sm ${
                  activeTab === `account-${subtab.id}`
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {subtab.label}
              </button>
            ))}
          </div>

          {/* Sub-tab: Perfil */}
          {activeTab === "account-profile" && (
            <UserProfile 
              currentUser={currentUser}
              onUserUpdate={(data) => console.log("User updated:", data)}
            />
          )}

          {/* Sub-tab: Membresía */}
          {activeTab === "account-subscription" && (
            <SubscriptionPlans 
              currentSubscription={userSubscriptions.find(us => us.userId === currentUser?.id)}
              subscriptions={subscriptions}
            />
          )}

          {/* Sub-tab: Vehículos */}
          {activeTab === "account-vehicles" && (
            <VehicleHistory 
              vehicles={vehicles.filter(v => v.conductorId === currentUser?.id)}
              currentUser={currentUser}
            />
          )}

          {/* Sub-tab: Soporte */}
          {activeTab === "account-support" && (
            <SupportSystem currentUser={currentUser} />
          )}

          {/* Sub-tab: Infracciones */}
          {activeTab === "account-infractions" && (
            <Infractions currentUser={currentUser} />
          )}
        </div>
      )}
    </div>
  );
}

export default ConductorView;
