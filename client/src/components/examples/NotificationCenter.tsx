import NotificationCenter from '../NotificationCenter';

export default function NotificationCenterExample() {
  const mockNotifications = [
    {
      id: "1",
      containerId: "c1",
      containerName: "Parque Central",
      message: "El contenedor está lleno. Busca una alternativa cercana.",
      read: false,
      createdAt: new Date(Date.now() - 300000)
    },
    {
      id: "2",
      containerId: "c2",
      containerName: "Plaza Italia",
      message: "Contenedor vaciado y disponible para uso.",
      read: false,
      createdAt: new Date(Date.now() - 3600000)
    },
    {
      id: "3",
      containerId: "c3",
      containerName: "Estación Norte",
      message: "Nivel medio alcanzado (70%). Considera depositar pronto.",
      read: true,
      createdAt: new Date(Date.now() - 86400000)
    },
  ];

  return (
    <div className="p-4">
      <NotificationCenter
        notifications={mockNotifications}
        onNotificationClick={(notification) => console.log('Notification clicked:', notification)}
        onMarkAsRead={(id) => console.log('Mark as read:', id)}
      />
    </div>
  );
}
