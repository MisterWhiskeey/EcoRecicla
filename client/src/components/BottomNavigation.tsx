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
      <div className="flex items-center justify-around p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <Button
              key={item.id}
              data-testid={`nav-${item.id}`}
              variant="ghost"
              onClick={() => onViewChange(item.id)}
              className={`flex-1 flex flex-col items-center gap-1 h-auto py-2 ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'fill-primary/20' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
