import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function ParkingMap({ parkings, onSelectParking, selectedParking }) {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Crear mapa centrado en Costa Rica (San Carlos)
    mapInstance.current = L.map(mapContainer.current).setView([10.3625, -84.4789], 12);

    // Agregar layer de OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(mapInstance.current);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Actualizar marcadores cuando los parqueos cambian
  useEffect(() => {
    if (!mapInstance.current) return;

    // Limpiar marcadores previos
    mapInstance.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapInstance.current.removeLayer(layer);
      }
    });

    // Agregar nuevos marcadores
    parkings.forEach((parking) => {
      const isSelected = selectedParking?.id === parking.id;
      const color = isSelected ? "#10b981" : parking.availableSpots > 0 ? "#3b82f6" : "#ef4444";
      
      const icon = L.divIcon({
        className: "custom-marker",
        html: `
          <div style="
            background-color: ${color};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 3px solid white;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            cursor: pointer;
          ">
            ${parking.availableSpots}
          </div>
        `,
        iconSize: [32, 32],
      });

      const marker = L.marker([parking.latitude, parking.longitude], { icon });
      
      marker.bindPopup(`
        <div style="font-size: 12px;">
          <strong>${parking.name}</strong><br/>
          Disponibles: ${parking.availableSpots}/${parking.capacity}<br/>
          Tarifa: ₡${parking.ratePerHour}/h
        </div>
      `);

      marker.on("click", () => onSelectParking(parking));
      marker.addTo(mapInstance.current);
    });
  }, [parkings, selectedParking, onSelectParking]);

  return (
    <div className="relative w-full h-[400px] rounded-[26px] border border-white/10 overflow-hidden shadow-lg">
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 shadow-lg">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Lleno</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span>Seleccionado</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParkingMap;
