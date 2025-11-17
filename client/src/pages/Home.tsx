import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import ContainerMap from "@/components/ContainerMap";
import ContainerDetails from "@/components/ContainerDetails";
import UserProfile from "@/components/UserProfile";
import BottomNavigation from "@/components/BottomNavigation";
import { Recycle } from "lucide-react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { sortContainersByDistance } from "@/lib/geo-utils";
import type { Container, UserStats } from "../../../server/simple-storage";

export default function Home() {
  const [activeView, setActiveView] = useState<"map" | "profile">("map");
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);

  // Ubicación fija del usuario (en Buenos Aires)
  const userLocation = { lat: -34.603722, lng: -58.381592 };

  const { data: containers = [], isLoading: containersLoading } = useQuery<Container[]>({
    queryKey: ["/api/containers"],
  });

  // Calcular distancias y ordenar contenedores del más cercano al más lejano
  const containersWithDistance = useMemo(() => {
    return sortContainersByDistance(containers, userLocation);
  }, [containers, userLocation]);

  useWebSocket<Container[]>("/ws/containers", (updatedContainers) => {
    queryClient.setQueryData(["/api/containers"], updatedContainers);
    
    if (selectedContainer) {
      const updatedSelected = sortContainersByDistance(updatedContainers, userLocation)
        .find(c => c.id === selectedContainer.id);
      if (updatedSelected) {
        setSelectedContainer(updatedSelected);
      }
    }
  });

  const { data: stats, isLoading: statsLoading } = useQuery<UserStats>({
    queryKey: ["/api/stats"],
  });

  const handleContainerSelect = (container: Container) => {
    setSelectedContainer(container);
  };

  const handleBackToMap = () => {
    setSelectedContainer(null);
  };

  if (containersLoading || statsLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <Recycle className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 bg-primary/10 rounded-md">
              <Recycle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">RecyclaTrack</h1>
              <p className="text-sm text-muted-foreground">Gestión Inteligente de Reciclaje</p>
            </div>
          </div>
          <div className="flex items-center flex-1 justify-center">
            <BottomNavigation
              activeView={activeView}
              onViewChange={(view) => {
                setActiveView(view);
              }}
            />
          </div>
          <div className="flex items-center gap-2 flex-1 justify-end">
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        {activeView === "map" && (
          <ContainerMap
            containers={containersWithDistance}
            onContainerSelect={handleContainerSelect}
            userLocation={userLocation}
            selectedContainer={selectedContainer}
            onBackToMap={handleBackToMap}
          />
        )}

        {activeView === "profile" && stats && (
          <UserProfile stats={stats} />
        )}
      </main>
    </div>
  );
}
