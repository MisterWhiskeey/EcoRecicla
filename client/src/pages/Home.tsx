import { useState } from "react";
import ContainerMap from "@/components/ContainerMap";
import ContainerDetails from "@/components/ContainerDetails";
import UserProfile from "@/components/UserProfile";
import NotificationCenter from "@/components/NotificationCenter";
import BottomNavigation from "@/components/BottomNavigation";
import ThemeToggle from "@/components/ThemeToggle";
import { Recycle } from "lucide-react";

interface Container {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  fillLevel: number;
  materials: string[];
  address: string;
}

interface Notification {
  id: string;
  containerId: string;
  containerName: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export default function Home() {
  const [activeView, setActiveView] = useState<"map" | "details" | "profile">("map");
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);

  const mockContainers: Container[] = [
    {
      id: "1",
      name: "Parque Central",
      latitude: -34.603722,
      longitude: -58.381592,
      fillLevel: 25,
      materials: ["Plástico", "Vidrio", "Papel"],
      address: "Av. Libertador 1234, Buenos Aires"
    },
    {
      id: "2",
      name: "Plaza Italia",
      latitude: -34.583,
      longitude: -58.420,
      fillLevel: 65,
      materials: ["Plástico", "Latas"],
      address: "Av. Santa Fe 4567, Buenos Aires"
    },
    {
      id: "3",
      name: "Estación Norte",
      latitude: -34.588,
      longitude: -58.373,
      fillLevel: 90,
      materials: ["Papel", "Cartón"],
      address: "Av. Cabildo 890, Buenos Aires"
    },
    {
      id: "4",
      name: "Centro Comercial",
      latitude: -34.605,
      longitude: -58.395,
      fillLevel: 15,
      materials: ["Plástico", "Vidrio", "Latas", "Papel"],
      address: "Calle Florida 2345, Buenos Aires"
    },
    {
      id: "5",
      name: "Mercado Sur",
      latitude: -34.615,
      longitude: -58.385,
      fillLevel: 55,
      materials: ["Orgánico", "Plástico"],
      address: "Av. Belgrano 6789, Buenos Aires"
    },
    {
      id: "6",
      name: "Universidad Central",
      latitude: -34.598,
      longitude: -58.388,
      fillLevel: 40,
      materials: ["Papel", "Cartón", "Plástico"],
      address: "Av. Corrientes 3456, Buenos Aires"
    },
  ];

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      containerId: "3",
      containerName: "Estación Norte",
      message: "El contenedor está lleno (90%). Te recomendamos buscar una alternativa cercana.",
      read: false,
      createdAt: new Date(Date.now() - 300000)
    },
    {
      id: "2",
      containerId: "2",
      containerName: "Plaza Italia",
      message: "Contenedor medio lleno (65%). Aún puedes depositar aquí.",
      read: false,
      createdAt: new Date(Date.now() - 3600000)
    },
  ]);

  const mockStats = {
    totalKg: 45.5,
    points: 650,
    streakDays: 12
  };

  const handleContainerSelect = (container: Container) => {
    setSelectedContainer(container);
    setActiveView("details");
  };

  const handleNotificationClick = (notification: Notification) => {
    const container = mockContainers.find(c => c.id === notification.containerId);
    if (container) {
      setSelectedContainer(container);
      setActiveView("details");
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleBackToMap = () => {
    setActiveView("map");
    setSelectedContainer(null);
  };

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
            containers={mockContainers}
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

        {activeView === "profile" && (
          <UserProfile stats={mockStats} />
        )}
      </main>

      <BottomNavigation
        activeView={activeView}
        onViewChange={(view) => {
          setActiveView(view);
          if (view === "details" && !selectedContainer && mockContainers.length > 0) {
            setSelectedContainer(mockContainers[0]);
          }
        }}
      />
    </div>
  );
}
