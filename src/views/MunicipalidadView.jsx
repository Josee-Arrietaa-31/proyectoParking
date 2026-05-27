import { useState } from "react";
import ParkingCard from "../components/ParkingCard";
import StatCard from "../components/StatCard";
import AdvancedReports from "../components/AdvancedReports";

function MunicipalidadView({ summary, parkings, formatCurrency }) {
  const [activeTab, setActiveTab] = useState("overview");
  // Calcular estadísticas por zona
  const zoneStats = parkings.reduce((acc, parking) => {
    const zone = parking.zone || "Sin zona";
    if (!acc[zone]) {
      acc[zone] = {
        name: zone,
        totalCapacity: 0,
        occupied: 0,
        available: 0,
        count: 0,
        revenue: 0
      };
    }
    acc[zone].totalCapacity += parking.capacity;
    acc[zone].available += parking.availableSpots;
    acc[zone].occupied += parking.capacity - parking.availableSpots;
    acc[zone].count += 1;
    return acc;
  }, {});

  const zoneArray = Object.values(zoneStats).sort((a, b) => b.count - a.count);
  
  // Calcular ocupación general en porcentaje
  const occupancyRate = summary.totalCapacity > 0 
    ? Math.round(((summary.occupiedSpots || 0) / summary.totalCapacity) * 100) 
    : 0;

  // Parqueos con mayor ocupación
  const topOccupiedParkings = [...parkings]
    .map(p => ({
      ...p,
      occupancyRate: p.capacity > 0 ? Math.round(((p.capacity - p.availableSpots) / p.capacity) * 100) : 0
    }))
    .sort((a, b) => b.occupancyRate - a.occupancyRate)
    .slice(0, 5);

  // Parqueos menos ocupados
  const topAvailableParkings = [...parkings]
    .map(p => ({
      ...p,
      occupancyRate: p.capacity > 0 ? Math.round(((p.capacity - p.availableSpots) / p.capacity) * 100) : 0
    }))
    .sort((a, b) => a.occupancyRate - b.occupancyRate)
    .slice(0, 5);

  return (
    <div className="mt-6 space-y-8">
      {/* Pestañas de navegación */}
      <div className="flex gap-2 border-b border-white/20 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-6 py-3 font-semibold transition whitespace-nowrap ${
            activeTab === "overview"
              ? "border-b-2 border-emerald-500 text-emerald-600"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          📊 Resumen General
        </button>
        <button
          onClick={() => setActiveTab("advanced")}
          className={`px-6 py-3 font-semibold transition whitespace-nowrap ${
            activeTab === "advanced"
              ? "border-b-2 border-emerald-500 text-emerald-600"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          📈 Reportes Avanzados
        </button>
        <button
          onClick={() => setActiveTab("zones")}
          className={`px-6 py-3 font-semibold transition whitespace-nowrap ${
            activeTab === "zones"
              ? "border-b-2 border-emerald-500 text-emerald-600"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          📍 Análisis por Zona
        </button>
        <button
          onClick={() => setActiveTab("details")}
          className={`px-6 py-3 font-semibold transition whitespace-nowrap ${
            activeTab === "details"
              ? "border-b-2 border-emerald-500 text-emerald-600"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          📋 Detalle Completo
        </button>
      </div>
      {/* Tab: Resumen General */}
      {activeTab === "overview" && (
        <>
          {/* Estadísticas principales */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">📊 Resumen general</h3>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <StatCard label="Parqueos" value={summary.totalParkings || 0} accent="text-slate-900" />
              <StatCard label="Capacidad total" value={summary.totalCapacity || 0} accent="text-cyan-700" />
              <StatCard label="Ocupados" value={summary.occupiedSpots || 0} accent="text-amber-700" />
              <StatCard label="Disponibles" value={summary.totalAvailable || 0} accent="text-emerald-700" />
              <StatCard label="Ocupación" value={`${occupancyRate}%`} accent="text-orange-700" />
            </div>
          </div>

          {/* Ingresos */}
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-lg p-6 border border-violet-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">💰 Ingresos acumulados</h3>
            <p className="text-4xl font-bold text-violet-700">{formatCurrency(summary.totalRevenue || 0)}</p>
          </div>

          {/* Estadísticas por zona */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">📍 Ocupación por zona</h3>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {zoneArray.map((zone) => {
                const zoneOccupancy = zone.totalCapacity > 0 
                  ? Math.round((zone.occupied / zone.totalCapacity) * 100)
                  : 0;
                
                return (
                  <div key={zone.name} className="bg-white rounded-lg p-4 border border-slate-200 hover:border-slate-300 transition">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-slate-900">{zone.name}</h4>
                      <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-1 rounded">
                        {zone.count} parqueos
                      </span>
                    </div>
                    
                    {/* Barra de ocupación */}
                    <div className="mb-3">
                      <div className="w-full bg-slate-200 rounded-full h-2 mb-1">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            zoneOccupancy >= 80 ? 'bg-rose-500' :
                            zoneOccupancy >= 50 ? 'bg-amber-500' :
                            'bg-emerald-500'
                          }`}
                          style={{ width: `${zoneOccupancy}%` }}
                        />
                      </div>
                      <p className="text-sm text-slate-600">
                        {zone.occupied}/{zone.totalCapacity} ocupados ({zoneOccupancy}%)
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-emerald-50 rounded p-2">
                        <p className="text-emerald-700 font-semibold">{zone.available}</p>
                        <p className="text-emerald-600">disponibles</p>
                      </div>
                      <div className="bg-amber-50 rounded p-2">
                        <p className="text-amber-700 font-semibold">{zone.occupied}</p>
                        <p className="text-amber-600">ocupados</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Parqueos con mayor ocupación */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">🔴 Parqueos con mayor ocupación</h3>
            <div className="bg-white rounded-lg overflow-hidden border border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left px-4 py-3 font-semibold text-slate-900">Parqueo</th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-900">Zona</th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-900">Tipo</th>
                      <th className="text-right px-4 py-3 font-semibold text-slate-900">Ocupación</th>
                      <th className="text-right px-4 py-3 font-semibold text-slate-900">Espacios</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topOccupiedParkings.map((parking) => (
                      <tr key={parking.id} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-900">{parking.name}</td>
                        <td className="px-4 py-3 text-slate-600">{parking.zone}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2 py-1 rounded ${
                            parking.type === 'privado' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {parking.type === 'privado' ? '🔒 Privado' : '🔓 Público'}
                          </span>
                        </td>
                        <td className="text-right px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <div className={`w-16 bg-slate-200 rounded-full h-2 ${
                              parking.occupancyRate >= 80 ? 'bg-rose-200' :
                              parking.occupancyRate >= 50 ? 'bg-amber-200' :
                              'bg-emerald-200'
                            }`}>
                              <div 
                                className={`h-2 rounded-full ${
                                  parking.occupancyRate >= 80 ? 'bg-rose-500' :
                                  parking.occupancyRate >= 50 ? 'bg-amber-500' :
                                  'bg-emerald-500'
                                }`}
                                style={{ width: `${parking.occupancyRate}%` }}
                              />
                            </div>
                            <span className="font-semibold text-slate-900 min-w-max">{parking.occupancyRate}%</span>
                          </div>
                        </td>
                        <td className="text-right px-4 py-3 font-medium text-slate-900">
                          {parking.availableSpots}/{parking.capacity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Parqueos con disponibilidad */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">🟢 Parqueos con más disponibilidad</h3>
            <div className="bg-white rounded-lg overflow-hidden border border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left px-4 py-3 font-semibold text-slate-900">Parqueo</th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-900">Zona</th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-900">Tarifa</th>
                      <th className="text-right px-4 py-3 font-semibold text-slate-900">Disponibles</th>
                      <th className="text-right px-4 py-3 font-semibold text-slate-900">% Libre</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topAvailableParkings.map((parking) => (
                      <tr key={parking.id} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-900">{parking.name}</td>
                        <td className="px-4 py-3 text-slate-600">{parking.zone}</td>
                        <td className="px-4 py-3 font-semibold text-emerald-700">₡{parking.ratePerHour}/hr</td>
                        <td className="text-right px-4 py-3 font-bold text-emerald-700">{parking.availableSpots}</td>
                        <td className="text-right px-4 py-3 font-semibold text-slate-900">
                          {Math.round((parking.availableSpots / parking.capacity) * 100)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Tab: Reportes Avanzados */}
      {activeTab === "advanced" && (
        <AdvancedReports parkings={parkings} payments={[]} summary={summary} />
      )}

      {/* Tab: Análisis por Zona */}
      {activeTab === "zones" && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">📍 Análisis detallado por zona</h3>
          <div className="grid gap-6">
            {zoneArray.map((zone) => {
              const zoneOccupancy = zone.totalCapacity > 0 
                ? Math.round((zone.occupied / zone.totalCapacity) * 100)
                : 0;
              const zoneParkings = parkings.filter(p => (p.zone || "Sin zona") === zone.name);

              return (
                <div key={zone.name} className="bg-white rounded-lg border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-semibold text-slate-900">{zone.name}</h4>
                    <div className="flex gap-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                        {zone.count} parqueos
                      </span>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        zoneOccupancy >= 80 ? 'bg-red-100 text-red-800' :
                        zoneOccupancy >= 50 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {zoneOccupancy}% ocupada
                      </span>
                    </div>
                  </div>

                  {/* Barra de ocupación grande */}
                  <div className="mb-6">
                    <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                      <div 
                        className={`h-3 rounded-full transition-all ${
                          zoneOccupancy >= 80 ? 'bg-rose-500' :
                          zoneOccupancy >= 50 ? 'bg-amber-500' :
                          'bg-emerald-500'
                        }`}
                        style={{ width: `${zoneOccupancy}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>{zone.occupied} ocupados</span>
                      <span>{zone.available} disponibles</span>
                      <span>Total: {zone.totalCapacity}</span>
                    </div>
                  </div>

                  {/* Parqueos en esta zona */}
                  <div className="grid gap-3 md:grid-cols-2">
                    {zoneParkings.map((parking) => (
                      <div key={parking.id} className="border border-slate-200 rounded-lg p-4 hover:border-slate-300">
                        <h5 className="font-semibold text-slate-900 mb-2">{parking.name}</h5>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <p className="text-slate-600">Ocupación</p>
                            <p className="font-semibold text-slate-900">
                              {Math.round(((parking.capacity - parking.availableSpots) / parking.capacity) * 100)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-600">Disponibles</p>
                            <p className="font-semibold text-slate-900">{parking.availableSpots}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Tarifa/hr</p>
                            <p className="font-semibold text-slate-900">₡{parking.ratePerHour}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Detalle Completo */}
      {activeTab === "details" && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">📋 Todos los parqueos</h3>
          <div className="grid gap-5 xl:grid-cols-2">
            {parkings.map((parking) => (
              <ParkingCard key={parking.id} parking={parking} formatCurrency={formatCurrency} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MunicipalidadView;
