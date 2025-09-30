import NotificationCenter from '../NotificationCenter';

export default function NotificationCenterExample() {
  const mockNotifications = [
    {
      id: "1",
      userId: "demo",
      containerId: "c1",
      message: "El contenedor está lleno. Busca una alternativa cercana.",
      read: 0,
      createdAt: new Date(Date.now() - 300000)
    },
    {
      id: "2",
      userId: "demo",
      containerId: "c2",
      message: "Contenedor vaciado y disponible para uso.",
      read: 0,
      createdAt: new Date(Date.now() - 3600000)
    },
    {
      id: "3",
      userId: "demo",
      containerId: "c3",
      message: "Nivel medio alcanzado (70%). Considera depositar pronto.",
      read: 1,
      createdAt: new Date(Date.now() - 86400000)
    },
  ];

  const mockContainers = [
    {
      id: "c1",
      name: "Parque Central",
      latitude: -34.603722,
      longitude: -58.381592,
      fillLevel: 90,
      materials: ["Plástico", "Vidrio"],
      address: "Av. Libertador 1234"
    },
    {
      id: "c2",
      name: "Plaza Italia",
      latitude: -34.583,
      longitude: -58.420,
      fillLevel: 20,
      materials: ["Papel"],
      address: "Av. Santa Fe 4567"
    },
    {
      id: "c3",
      name: "Estación Norte",
      latitude: -34.588,
      longitude: -58.373,
      fillLevel: 70,
      materials: ["Latas"],
      address: "Av. Cabildo 890"
    }
  ];

  return (
    <div className="p-4">
      <NotificationCenter
        notifications={mockNotifications}
        containers={mockContainers}
        onNotificationClick={(notification) => console.log('Notification clicked:', notification)}
        onMarkAsRead={(id) => console.log('Mark as read:', id)}
      />
    </div>
  );
}
