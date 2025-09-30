// Función para calcular la distancia entre dos puntos usando la fórmula de Haversine
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Radio de la Tierra en kilómetros
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Redondear a 2 decimales
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Función para formatear la distancia de manera legible
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  } else {
    return `${distance.toFixed(1)}km`;
  }
}

// Función para ordenar contenedores por distancia
export function sortContainersByDistance<T extends { latitude: number; longitude: number }>(
  containers: T[],
  userLocation: { lat: number; lng: number }
): (T & { distance: number })[] {
  return containers
    .map(container => ({
      ...container,
      distance: calculateDistance(
        userLocation.lat,
        userLocation.lng,
        container.latitude,
        container.longitude
      )
    }))
    .sort((a, b) => a.distance - b.distance);
}