import { Bell, X, MapPin, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Notification, Container } from "@shared/schema";

interface NotificationCenterProps {
  notifications: Notification[];
  containers: Container[];
  onNotificationClick: (notification: Notification) => void;
  onMarkAsRead: (id: string) => void;
}

export default function NotificationCenter({
  notifications,
  containers,
  onNotificationClick,
  onMarkAsRead,
}: NotificationCenterProps) {
  const unreadCount = notifications.filter(n => n.read === 0).length;
  
  const getContainerName = (containerId: string) => {
    const container = containers.find(c => c.id === containerId);
    return container?.name || "Contenedor desconocido";
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `Hace ${minutes}m`;
    if (hours < 24) return `Hace ${hours}h`;
    return `Hace ${days}d`;
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          data-testid="button-notifications"
          size="icon"
          variant="ghost"
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive"
              data-testid="badge-notification-count"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notificaciones</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No tienes notificaciones
            </div>
          ) : (
            notifications.map((notification) => (
              <Card
                key={notification.id}
                data-testid={`notification-${notification.id}`}
                className={`p-4 hover-elevate cursor-pointer ${
                  notification.read === 0 ? 'border-l-4 border-l-primary' : ''
                }`}
                onClick={() => {
                  onNotificationClick(notification);
                  onMarkAsRead(notification.id);
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-destructive/10 rounded-md">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-sm">{getContainerName(notification.containerId)}</p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTime(new Date(notification.createdAt))}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        data-testid={`button-view-container-${notification.id}`}
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNotificationClick(notification);
                        }}
                      >
                        <MapPin className="h-3 w-3 mr-1" />
                        Ver contenedor
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
