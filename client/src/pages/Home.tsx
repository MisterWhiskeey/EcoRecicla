import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import ContainerMap from "@/components/ContainerMap";
import ContainerDetails from "@/components/ContainerDetails";
import UserProfile from "@/components/UserProfile";
import NotificationCenter from "@/components/NotificationCenter";
import BottomNavigation from "@/components/BottomNavigation";
import ThemeToggle from "@/components/ThemeToggle";
import { Recycle } from "lucide-react";
import { useWebSocket } from "@/hooks/useWebSocket";
import type { Container, Notification, UserStats } from "@shared/schema";

export default function Home() {
  const [activeView, setActiveView] = useState<"map" | "details" | "profile">("map");
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);

  const { data: containers = [], isLoading: containersLoading } = useQuery<Container[]>({
    queryKey: ["/api/containers"],
  });

  useWebSocket<Container[]>("/ws/containers", (updatedContainers) => {
    queryClient.setQueryData(["/api/containers"], updatedContainers);
    
    if (selectedContainer) {
      const updatedSelected = updatedContainers.find(c => c.id === selectedContainer.id);
      if (updatedSelected) {
        setSelectedContainer(updatedSelected);
      }
    }
  });

  const { data: stats, isLoading: statsLoading } = useQuery<UserStats>({
    queryKey: ["/api/stats"],
  });

  const { data: notifications = [], isLoading: notificationsLoading } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("PATCH", `/api/notifications/${id}/read`);
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["/api/notifications"] });
      const previousNotifications = queryClient.getQueryData<Notification[]>(["/api/notifications"]);
      
      queryClient.setQueryData<Notification[]>(["/api/notifications"], (old) => 
        old?.map(n => n.id === id ? { ...n, read: 1 } : n) ?? []
      );
      
      return { previousNotifications };
    },
    onError: (_err, _id, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(["/api/notifications"], context.previousNotifications);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  const handleContainerSelect = (container: Container) => {
    setSelectedContainer(container);
    setActiveView("details");
  };

  const handleNotificationClick = (notification: Notification) => {
    const container = containers.find(c => c.id === notification.containerId);
    if (container) {
      setSelectedContainer(container);
      setActiveView("details");
    }
  };

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const handleBackToMap = () => {
    setActiveView("map");
    setSelectedContainer(null);
  };

  if (containersLoading || statsLoading || notificationsLoading) {
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
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-md">
              <Recycle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">RecyclaTrack</h1>
              <p className="text-sm text-muted-foreground">Gestión Inteligente de Reciclaje</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <NotificationCenter
              notifications={notifications}
              containers={containers}
              onNotificationClick={handleNotificationClick}
              onMarkAsRead={handleMarkAsRead}
            />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        {activeView === "map" && (
          <ContainerMap
            containers={containers}
            onContainerSelect={handleContainerSelect}
            userLocation={{ lat: -34.603722, lng: -58.381592 }}
          />
        )}

        {activeView === "details" && selectedContainer && (
          <ContainerDetails
            container={selectedContainer}
            onBack={handleBackToMap}
          />
        )}

        {activeView === "profile" && stats && (
          <UserProfile stats={stats} />
        )}
      </main>

      <BottomNavigation
        activeView={activeView}
        onViewChange={(view) => {
          setActiveView(view);
          if (view === "details" && !selectedContainer && containers.length > 0) {
            setSelectedContainer(containers[0]);
          }
        }}
      />
    </div>
  );
}
