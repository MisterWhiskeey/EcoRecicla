import { Map, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BottomNavigationProps {
  activeView: "map" | "profile";
  onViewChange: (view: "map" | "profile") => void;
}

export default function BottomNavigation({ activeView, onViewChange }: BottomNavigationProps) {
  const navItems = [
    { id: "map" as const, label: "Mapa", icon: Map },
    { id: "profile" as const, label: "Perfil", icon: User },
  ];

  return (
    <div className="flex items-center gap-2">
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
            className="gap-1.5 px-2.5"
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="text-xs">{item.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
