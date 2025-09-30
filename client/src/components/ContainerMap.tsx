import { useState, useMemo } from "react";
import { MapPin, Navigation, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { sortContainersByDistance, formatDistance } from "@/lib/geo-utils";

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
}

export default function ContainerMap({ containers, onContainerSelect, userLocation }: ContainerMapProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);

  // Ordenar contenedores por distancia si hay ubicación del usuario
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
    setSelectedContainer(container);
    onContainerSelect(container);
  };

  const filteredContainers = sortedContainers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative h-full flex flex-col">
      <div className="absolute top-4 left-4 right-4 z-10 space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              data-testid="input-search-container"
              placeholder="Buscar contenedor o dirección..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card"
            />
          </div>
          <Button
            data-testid="button-find-nearest"
            size="icon"
            variant="default"
          >
            <Navigation className="h-4 w-4" />
          </Button>
        </div>
        {userLocation && (
          <div className="bg-card/95 backdrop-blur-sm rounded-md px-3 py-2 text-sm text-muted-foreground">
            📍 Ordenados por distancia (del más cercano al más lejano)
          </div>
        )}

        {selectedContainer && (
          <Card className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
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
              data-testid="button-view-details"
              onClick={() => onContainerSelect(selectedContainer)}
              className="w-full"
            >
              Ver detalles
            </Button>
          </Card>
        )}
      </div>

      <div className="flex-1 bg-muted relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-8 max-w-4xl w-full max-h-full overflow-auto">
            {filteredContainers.map((container) => (
              <button
                key={container.id}
                data-testid={`button-container-${container.id}`}
                onClick={() => handleContainerClick(container)}
                className={`p-4 rounded-md hover-elevate active-elevate-2 transition-all ${
                  selectedContainer?.id === container.id ? 'bg-accent' : 'bg-card'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <MapPin className={`h-8 w-8 ${
                      container.fillLevel < 40 ? 'text-container-empty' :
                      container.fillLevel < 80 ? 'text-container-medium' : 'text-container-full'
                    }`} />
                    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${getFillLevelColor(container.fillLevel)}`} />
                  </div>
                  <span className="text-xs font-medium text-center">{container.name}</span>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs text-muted-foreground">{container.fillLevel}%</span>
                    {container.distance !== undefined && (
                      <span className="text-xs font-medium text-blue-600">
                        {formatDistance(container.distance)}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
