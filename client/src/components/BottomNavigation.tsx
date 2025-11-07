import { Map, Info, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BottomNavigationProps {
  activeView: "map" | "details" | "profile";
  onViewChange: (view: "map" | "details" | "profile") => void;
}

export default function BottomNavigation({ activeView, onViewChange }: BottomNavigationProps) {
  const navItems = [
    { id: "map" as const, label: "Mapa", icon: Map },
    { id: "details" as const, label: "Instrucciones", icon: Info },
    { id: "profile" as const, label: "Perfil", icon: User },
  ];

  return (
    <div className="border-t bg-card">
      <div className="flex items-center justify-center gap-2 p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <Button
              key={item.id}
              data-testid={`nav-${item.id}`}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange(item.id)}
              className="px-3"
              title={item.label}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
      </div>
    </div>
  );
}
