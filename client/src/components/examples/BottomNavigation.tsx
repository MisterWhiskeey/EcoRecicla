import { useState } from 'react';
import BottomNavigation from '../BottomNavigation';

export default function BottomNavigationExample() {
  const [activeView, setActiveView] = useState<"map" | "details" | "profile">("map");

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center bg-muted">
        <p className="text-lg font-medium">Vista activa: {activeView}</p>
      </div>
      <BottomNavigation
        activeView={activeView}
        onViewChange={setActiveView}
      />
    </div>
  );
}
