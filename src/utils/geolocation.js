/**
 * Calcula la distancia entre dos coordenadas usando la fórmula de Haversine
 * @param {number} lat1 - Latitud del punto 1
 * @param {number} lon1 - Longitud del punto 1
 * @param {number} lat2 - Latitud del punto 2
 * @param {number} lon2 - Longitud del punto 2
 * @returns {number} Distancia en kilómetros
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Obtiene la ubicación del usuario usando Geolocation API
 * @returns {Promise<{latitude: number, longitude: number}>} Coordenadas del usuario
 */
export function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocalización no disponible en tu navegador"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(new Error("No se pudo obtener tu ubicación. Verifica los permisos."));
      }
    );
  });
}

/**
 * Define las zonas disponibles en la ciudad
 */
export const ZONES = [
  { id: "Centro", name: "🏙️ Centro", color: "emerald" },
  { id: "Norte", name: "⬆️ Norte", color: "blue" },
  { id: "Sur", name: "⬇️ Sur", color: "orange" },
  { id: "Este", name: "➡️ Este", color: "purple" },
  { id: "Oeste", name: "⬅️ Oeste", color: "pink" },
  { id: "Fortuna", name: "🌴 Fortuna", color: "amber" }
];
