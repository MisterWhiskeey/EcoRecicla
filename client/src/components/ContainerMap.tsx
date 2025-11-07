import { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { MapPin, Navigation, Search, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
}

const createCustomIcon = (fillLevel: number) => {
  const color = fillLevel < 40 ? '#22c55e' : fillLevel < 80 ? '#f59e0b' : '#ef4444';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position: relative;">
        <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 11.625 14.5 25.5 15.25 26.125a1 1 0 001.5 0C17.5 41.5 32 27.625 32 16 32 7.163 24.837 0 16 0z" fill="${color}"/>
          <circle cx="16" cy="16" r="6" fill="white"/>
        </svg>
        <div style="position: absolute; top: 10px; left: 50%; transform: translateX(-50%); color: ${color}; font-weight: bold; font-size: 10px;">
          ${fillLevel}%
        </div>
      </div>
    `,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42]
  });
};

const createUserIcon = () => {
  return L.divIcon({
    className: 'user-marker',
    html: `
      <div style="position: relative;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#3b82f6" stroke="white" stroke-width="2"/>
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

export default function ContainerMap({ containers, onContainerSelect, userLocation, selectedContainer: externalSelectedContainer, onBackToMap }: ContainerMapProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [internalSelectedContainer, setInternalSelectedContainer] = useState<Container | null>(null);
  
  const selectedContainer = externalSelectedContainer ?? internalSelectedContainer;

  const sortedContainers = useMemo(() => {
    if (userLocation) {
      return sortContainersByDistance(containers, userLocation);
    }
    return containers.map(container => ({ ...container, distance: undefined }));
  }, [containers, userLocation]);

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

  const filteredContainers = sortedContainers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const mapCenter: [number, number] = userLocation 
    ? [userLocation.lat, userLocation.lng]
    : [-34.603722, -58.381592];

  return (
    <div className="relative h-full flex flex-col">
      <div className="absolute top-4 left-4 z-[1000] space-y-4">
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              data-testid="input-search-container"
              placeholder="Buscar contenedor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card w-[280px]"
            />
          </div>
          <Button
            data-testid="button-find-nearest"
            size="icon"
            variant="default"
            onClick={() => {
              if (filteredContainers.length > 0) {
                setInternalSelectedContainer(filteredContainers[0]);
                onContainerSelect(filteredContainers[0]);
              }
            }}
          >
            <Navigation className="h-4 w-4" />
          </Button>
        </div>
        
        <Card className="bg-card/95 backdrop-blur-sm p-2 w-fit">
          <div className="flex items-center gap-1.5 mb-2">
            <Info className="h-4 w-4" />
            <span className="text-sm font-medium">Leyenda</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-container-empty flex-shrink-0" />
              <span className="text-xs leading-tight">Disponible</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-container-medium flex-shrink-0" />
              <span className="text-xs leading-tight">Medio</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-container-full flex-shrink-0" />
              <span className="text-xs leading-tight">Lleno</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-blue-500 border border-white flex-shrink-0" />
              <span className="text-xs leading-tight">Tu ubicación</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="absolute top-4 right-4 z-[1000]">
        <Card className="bg-card/95 backdrop-blur-sm p-2 w-[200px]">
          <div className="flex items-center gap-1.5 mb-2">
            <Info className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">Instrucciones de Reciclaje</span>
          </div>
          <div className="space-y-1.5">
            <div>
              <p className="text-[10px] font-medium">Papel y Cartón:</p>
              <p className="text-[10px] leading-tight text-muted-foreground">
                Limpio y seco, sin grasas ni comida
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium">Plástico:</p>
              <p className="text-[10px] leading-tight text-muted-foreground">
                Botellas vacías, enjuagadas
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium">Vidrio:</p>
              <p className="text-[10px] leading-tight text-muted-foreground">
                Sin tapas, limpio y completo
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium">Metal:</p>
              <p className="text-[10px] leading-tight text-muted-foreground">
                Latas limpias y aplastadas
              </p>
            </div>
          </div>
        </Card>
      </div>

      {selectedContainer && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-[400px]">
          <Card className="p-4 space-y-3 bg-card/95 backdrop-blur-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold">{selectedContainer.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedContainer.address}</p>
                {selectedContainer.distance !== undefined && (
                  <p className="text-sm font-medium text-blue-600 mt-1">
                    📍 {formatDistance(selectedContainer.distance)}
                  </p>
                )}
              </div>
              <Badge
                className={`${getFillLevelColor(selectedContainer.fillLevel)} text-white`}
                data-testid={`badge-status-${selectedContainer.id}`}
              >
                {getFillLevelText(selectedContainer.fillLevel)}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedContainer.materials.map((material) => (
                <Badge key={material} variant="outline" data-testid={`badge-material-${material}`}>
                  {material}
                </Badge>
              ))}
            </div>
            <Button
              data-testid="button-close-details"
              onClick={handleCloseDetails}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Cerrar
            </Button>
          </Card>
        </div>
      )}

      <div className="flex-1 relative">
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {userLocation && (
            <Marker 
              position={[userLocation.lat, userLocation.lng]}
              icon={createUserIcon()}
            >
              <Popup>
                <div className="text-center">
                  <strong>Tu ubicación</strong>
                </div>
              </Popup>
            </Marker>
          )}

          {filteredContainers.map((container) => (
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
