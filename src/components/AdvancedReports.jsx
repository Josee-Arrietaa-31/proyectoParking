import { useState } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AdvancedReports({ parkings, payments, summary }) {
  const [dateRange, setDateRange] = useState("all");

  // Estadísticas por zona
  const zoneStats = parkings.reduce((acc, parking) => {
    const zone = parking.zone || "Sin zona";
    if (!acc[zone]) {
      acc[zone] = {
        name: zone,
        totalCapacity: 0,
        occupied: 0,
        available: 0,
        revenue: 0
      };
    }
    acc[zone].totalCapacity += parking.capacity;
    acc[zone].available += parking.availableSpots;
    acc[zone].occupied += parking.capacity - parking.availableSpots;
    return acc;
  }, {});

  const zones = Object.values(zoneStats);
  const occupancyData = {
    labels: zones.map(z => z.name),
    datasets: [
      {
        label: "Ocupados",
        data: zones.map(z => z.occupied),
        backgroundColor: "rgba(255, 99, 132, 0.7)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1
      },
      {
        label: "Disponibles",
        data: zones.map(z => z.available),
        backgroundColor: "rgba(75, 192, 75, 0.7)",
        borderColor: "rgba(75, 192, 75, 1)",
        borderWidth: 1
      }
    ]
  };

  // Ingresos por zona
  const revenueData = {
    labels: zones.map(z => z.name),
    datasets: [
      {
        label: "Ingresos (₡)",
        data: zones.map(zone => {
          return parkings
            .filter(p => p.zone === zone.name || (zone.name === "Sin zona" && !p.zone))
            .reduce((sum, p) => sum + (p.ratePerHour * 8), 0); // Estimado por día
        }),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Distribución de parqueos
  const typeDistribution = parkings.reduce((acc, p) => {
    acc[p.type] = (acc[p.type] || 0) + 1;
    return acc;
  }, {});

  const typeData = {
    labels: Object.keys(typeDistribution).map(t => t.charAt(0).toUpperCase() + t.slice(1)),
    datasets: [
      {
        data: Object.values(typeDistribution),
        backgroundColor: [
          "rgba(255, 159, 64, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)"
        ],
        borderColor: [
          "rgba(255, 159, 64, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)"
        ],
        borderWidth: 2
      }
    ]
  };

  // Parqueos con mejor rendimiento
  const topParkings = [...parkings]
    .map(p => ({
      ...p,
      occupancyRate: p.capacity > 0 ? Math.round(((p.capacity - p.availableSpots) / p.capacity) * 100) : 0,
      estimatedDailyRevenue: p.ratePerHour * 8
    }))
    .sort((a, b) => b.estimatedDailyRevenue - a.estimatedDailyRevenue)
    .slice(0, 5);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: "#666"
        }
      }
    },
    scales: {
      y: {
        ticks: {
          color: "#666"
        },
        grid: {
          color: "rgba(0,0,0,0.1)"
        }
      },
      x: {
        ticks: {
          color: "#666"
        },
        grid: {
          color: "rgba(0,0,0,0.1)"
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtro de rango de fechas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Período:
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">Todo el tiempo</option>
            <option value="7days">Últimos 7 días</option>
            <option value="30days">Últimos 30 días</option>
            <option value="90days">Últimos 90 días</option>
          </select>
        </div>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">Total Parqueos</p>
          <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">{summary.totalParkings}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg p-4">
          <p className="text-sm text-green-600 dark:text-green-400 font-semibold">Espacios Disponibles</p>
          <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-2">{summary.totalAvailable}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 rounded-lg p-4">
          <p className="text-sm text-red-600 dark:text-red-400 font-semibold">Ocupados</p>
          <p className="text-3xl font-bold text-red-900 dark:text-red-100 mt-2">{summary.occupiedSpots}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg p-4">
          <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold">Ingresos Totales</p>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-2">₡{summary.totalRevenue?.toLocaleString()}</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ocupación por zona */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Ocupación por Zona
          </h3>
          <div style={{ height: "300px" }}>
            <Bar data={occupancyData} options={chartOptions} />
          </div>
        </div>

        {/* Distribución de tipos */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Distribución de Parqueos
          </h3>
          <div style={{ height: "300px" }}>
            <Doughnut data={typeData} options={chartOptions} />
          </div>
        </div>

        {/* Ingresos estimados */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Ingresos Estimados por Zona (Diarios)
          </h3>
          <div style={{ height: "300px" }}>
            <Line data={revenueData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Top Parqueos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top 5 Parqueos por Ingresos Estimados
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Nombre</th>
                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Zona</th>
                <th className="text-center py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Ocupación</th>
                <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Ingresos/Día</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {topParkings.map((parking, idx) => (
                <tr key={parking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4 text-gray-900 dark:text-white">
                    #{idx + 1} {parking.name}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {parking.zone || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      parking.occupancyRate > 70
                        ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                        : parking.occupancyRate > 40
                        ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                        : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                    }`}>
                      {parking.occupancyRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">
                    ₡{parking.estimatedDailyRevenue?.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Botones de exportación */}
      <div className="flex gap-3 justify-end">
        <button
          onClick={() => {
            const csv = "Parqueo,Zona,Ocupacion,Ingresos\n" + 
              topParkings.map(p => `"${p.name}","${p.zone}","${p.occupancyRate}%","${p.estimatedDailyRevenue}"`).join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "reporte-parqueos.csv";
            a.click();
          }}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
        >
          📥 Descargar CSV
        </button>
        <button
          onClick={() => window.print()}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition"
        >
          🖨️ Imprimir Reporte
        </button>
      </div>
    </div>
  );
}
