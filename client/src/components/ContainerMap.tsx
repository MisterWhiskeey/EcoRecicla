import { useState, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from "react-leaflet";
import { MapPin, Info, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { sortContainersByDistance, formatDistance } from "@/lib/geo-utils";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Container {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  fillLevel: number;
  materials: string[];
  address: string;
  distance?: number;
}

interface ContainerMapProps {
  containers: Container[];
  onContainerSelect: (container: Container) => void;
  userLocation?: { lat: number; lng: number };
  selectedContainer?: Container | null;
  onBackToMap?: () => void;
  notificationsEnabled?: boolean;
}

const createCustomIcon = (fillLevel: number) => {
  const color = fillLevel < 40 ? '#22c55e' : fillLevel < 80 ? '#f59e0b' : '#ef4444';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position: relative;">
        <svg width="60" height="75" viewBox="0 0 60 75" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 0C13.431 0 0 13.431 0 30c0 22.5 27 42 28.5 43.5a1.5 1.5 0 003 0C33 72 60 52.5 60 30 60 13.431 46.569 0 30 0z" fill="${color}"/>
          <circle cx="30" cy="30" r="18" fill="white"/>
        </svg>
        <div style="position: absolute; top: 18px; left: 50%; transform: translateX(-50%); color: ${color}; font-weight: bold; font-size: 15px; text-align: center; width: 36px;">
          ${fillLevel}%
        </div>
      </div>
    `,
    iconSize: [60, 75],
    iconAnchor: [30, 75],
    popupAnchor: [0, -75]
  });
};

const createUserIcon = () => {
  return L.divIcon({
    className: 'user-marker',
    html: `
      <div style="position: relative;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#3b82f6" stroke="white" stroke-width="1"/>
          <circle cx="12" cy="12" r="4" fill="white"/>
        </svg>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

export default function ContainerMap({ containers, onContainerSelect, userLocation, selectedContainer: externalSelectedContainer, onBackToMap, notificationsEnabled = true }: ContainerMapProps) {
  const [internalSelectedContainer, setInternalSelectedContainer] = useState<Container | null>(null);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState<boolean>(false);
  
  const selectedContainer = externalSelectedContainer ?? internalSelectedContainer;

  const sortedContainers = useMemo(() => {
    if (userLocation) {
      return sortContainersByDistance(containers, userLocation);
    }
    return containers.map(container => ({ ...container, distance: undefined }));
  }, [containers, userLocation]);

  // Detectar contenedores disponibles cerca (top 3)
  const nearbyAvailableContainers = useMemo(() => {
    if (!userLocation) return [];
    const available = sortedContainers.filter(container => 
      container.fillLevel < 40 && // Disponible
      container.distance !== undefined && 
      container.distance <= 1000 // Dentro de 1000m
    );
    return available.slice(0, 3); // Solo los 3 más cercanos
  }, [sortedContainers, userLocation]);

  const getFillLevelColor = (level: number) => {
    if (level < 40) return "bg-container-empty";
    if (level < 80) return "bg-container-medium";
    return "bg-container-full";
  };

  const getFillLevelText = (level: number) => {
    if (level < 40) return "Disponible";
    if (level < 80) return "Medio lleno";
    return "Lleno";
  };

  const handleContainerClick = (container: Container) => {
    setInternalSelectedContainer(container);
    onContainerSelect(container);
  };

  const handleCloseDetails = () => {
    setInternalSelectedContainer(null);
    if (onBackToMap) {
      onBackToMap();
    }
  };

  const mapCenter: [number, number] = userLocation 
    ? [userLocation.lat, userLocation.lng]
    : [-34.603722, -58.381592];

  return (
    <div className="relative h-full flex flex-col">
      <div className="absolute top-4 left-4 z-[1000] space-y-4">
        <Card className="bg-card/95 backdrop-blur-sm p-3 w-fit">
          <div className="flex items-center gap-2 mb-3">
            <Info className="h-5 w-5" />
            <span className="text-base font-medium">Leyenda</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-container-empty flex-shrink-0" />
              <span className="text-sm leading-tight">Disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-container-medium flex-shrink-0" />
              <span className="text-sm leading-tight">Medio</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-container-full flex-shrink-0" />
              <span className="text-sm leading-tight">Lleno</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500 border border-white flex-shrink-0" />
              <span className="text-sm leading-tight">Tu ubicación</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="absolute top-4 right-4 z-[1000]">
        <Card className="bg-card/95 backdrop-blur-sm p-2 w-[200px]">
          <div className="flex items-center gap-1.5 mb-2">
            <Info className="h-4 w-4" />
            <span className="text-sm font-medium">Instrucciones de Reciclaje</span>
          </div>
          <div className="space-y-1.5">
            <div>
              <p className="text-xs font-medium">Papel:</p>
              <p className="text-xs leading-tight text-muted-foreground">
                Limpio y seco, sin grasas
              </p>
            </div>
            <div>
              <p className="text-xs font-medium">Cartón:</p>
              <p className="text-xs leading-tight text-muted-foreground">
                Doblado, sin cintas ni grapas
              </p>
            </div>
            <div>
              <p className="text-xs font-medium">Plástico:</p>
              <p className="text-xs leading-tight text-muted-foreground">
                Botellas vacías, enjuagadas
              </p>
            </div>
            <div>
              <p className="text-xs font-medium">Vidrio:</p>
              <p className="text-xs leading-tight text-muted-foreground">
                Sin tapas, limpio y completo
              </p>
            </div>
            <div>
              <p className="text-xs font-medium">Latas:</p>
              <p className="text-xs leading-tight text-muted-foreground">
                Limpias y aplastadas
              </p>
            </div>
            <div>
              <p className="text-xs font-medium">Orgánico:</p>
              <p className="text-xs leading-tight text-muted-foreground">
                Restos vegetales, sin líquidos
              </p>
            </div>
          </div>
        </Card>

        {/* Panel de notificaciones de contenedores cercanos */}
        {notificationsEnabled && nearbyAvailableContainers.length > 0 && (
          <Card className="bg-card/95 backdrop-blur-sm p-2 w-[200px] mt-4">
            <Button
              variant="ghost"
              className="w-full justify-between p-2 h-auto"
              onClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Bell className="h-4 w-4 text-primary" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center">
                    {nearbyAvailableContainers.length}
                  </span>
                </div>
                <span className="text-sm font-medium">Cercanos</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {notificationPanelOpen ? '▼' : '▶'}
              </span>
            </Button>

            {notificationPanelOpen && (
              <div className="mt-2 space-y-2 border-t pt-2">
                {nearbyAvailableContainers.map((container) => (
                  <button
                    key={container.id}
                    onClick={() => handleContainerClick(container)}
                    className="w-full text-left p-2 rounded hover:bg-accent transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{container.name}</p>
                        <p className="text-xs text-muted-foreground">
                          📍 {formatDistance(container.distance || 0)}
                        </p>
                        <p className="text-xs text-green-600">
                          {container.fillLevel}% lleno
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>

      <div className="flex-1 relative">
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <ZoomControl position="bottomleft" />
          
          {userLocation && (
            <Marker 
              position={[userLocation.lat, userLocation.lng]}
              icon={createUserIcon()}
            />
          )}

          {sortedContainers.map((container) => (
            <Marker
              key={container.id}
              position={[container.latitude, container.longitude]}
              icon={createCustomIcon(container.fillLevel)}
              eventHandlers={{
                click: () => handleContainerClick(container)
              }}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <h3 className="font-semibold mb-1">{container.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{container.address}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`${getFillLevelColor(container.fillLevel)} text-white`}>
                      {getFillLevelText(container.fillLevel)} ({container.fillLevel}%)
                    </Badge>
                  </div>
                  {container.distance !== undefined && (
                    <p className="text-sm font-medium text-blue-600 mb-2">
                      📍 {formatDistance(container.distance)}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {container.materials.map((material) => (
                      <Badge key={material} variant="outline" className="text-xs">
                        {material}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          <MapUpdater center={mapCenter} />
        </MapContainer>
      </div>
    </div>
  );
}
