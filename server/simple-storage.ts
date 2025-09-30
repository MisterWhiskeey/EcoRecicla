import { randomUUID } from "crypto";

// Tipos simplificados sin base de datos
export type Container = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  fillLevel: number;
  materials: string[];
  address: string;
};

export type User = {
  id: string;
  username: string;
  password: string;
};

export type UserStats = {
  id: string;
  userId: string;
  totalKg: number;
  points: number;
  streakDays: number;
};

export type Notification = {
  id: string;
  userId: string;
  containerId: string;
  message: string;
  read: number;
  createdAt: Date;
};

// Datos hardcodeados para demo
export class SimpleStorage {
  private containers: Container[] = [
    {
      id: "1",
      name: "Supermercado Esquina",
      latitude: -34.601722,
      longitude: -58.383592,
      fillLevel: 25,
      materials: ["Plástico", "Vidrio", "Papel"],
      address: "Av. Libertador 1234, Buenos Aires"
    },
    {
      id: "2", 
      name: "Farmacia Central",
      latitude: -34.607722,
      longitude: -58.379592,
      fillLevel: 65,
      materials: ["Plástico", "Latas"],
      address: "Av. Santa Fe 4567, Buenos Aires"
    },
    {
      id: "3",
      name: "Plaza del Barrio",
      latitude: -34.593722,
      longitude: -58.391592,
      fillLevel: 40,
      materials: ["Papel", "Cartón"],
      address: "Av. Cabildo 890, Buenos Aires"
    },
    {
      id: "4",
      name: "Centro Comercial",
      latitude: -34.585722,
      longitude: -58.401592,
      fillLevel: 15,
      materials: ["Plástico", "Vidrio", "Latas", "Papel"],
      address: "Calle Florida 2345, Buenos Aires"
    },
    {
      id: "5",
      name: "Estación de Servicio",
      latitude: -34.635722,
      longitude: -58.351592,
      fillLevel: 90,
      materials: ["Orgánico", "Plástico"],
      address: "Av. Belgrano 6789, Buenos Aires"
    },
    {
      id: "6",
      name: "Universidad Central",
      latitude: -34.611722,
      longitude: -58.375592,
      fillLevel: 40,
      materials: ["Papel", "Cartón", "Plástico"],
      address: "Av. Corrientes 3456, Buenos Aires"
    },
    {
      id: "7",
      name: "Hospital San Juan",
      latitude: -34.600722,
      longitude: -58.385592,
      fillLevel: 75,
      materials: ["Vidrio", "Plástico"],
      address: "Av. Rivadavia 5678, Buenos Aires"
    },
    {
      id: "8",
      name: "Parque Ecológico",
      latitude: -34.570722,
      longitude: -58.420592,
      fillLevel: 10,
      materials: ["Orgánico", "Papel", "Cartón"],
      address: "Av. Costanera Norte 9012, Buenos Aires"
    }
  ];

  private userStats: UserStats = {
    id: "demo-stats",
    userId: "demo-user",
    totalKg: 45.5,
    points: 650,
    streakDays: 12
  };

  private notifications: Notification[] = [
    {
      id: "1",
      userId: "demo-user",
      containerId: "5",
      message: "El contenedor está lleno (90%). Te recomendamos buscar una alternativa cercana.",
      read: 0,
      createdAt: new Date(Date.now() - 300000) // 5 minutos atrás
    },
    {
      id: "2",
      userId: "demo-user", 
      containerId: "7",
      message: "Contenedor con nivel medio (75%). Considera depositar pronto.",
      read: 0,
      createdAt: new Date(Date.now() - 3600000) // 1 hora atrás
    },
    {
      id: "3",
      userId: "demo-user",
      containerId: "2",
      message: "Contenedor con nivel medio alcanzado (65%).",
      read: 1,
      createdAt: new Date(Date.now() - 86400000) // 1 día atrás
    }
  ];

  // Métodos para contenedores
  async getAllContainers(): Promise<Container[]> {
    return [...this.containers];
  }

  async getContainer(id: string): Promise<Container | undefined> {
    return this.containers.find(c => c.id === id);
  }

  async updateContainerFillLevel(id: string, fillLevel: number): Promise<void> {
    const container = this.containers.find(c => c.id === id);
    if (container) {
      container.fillLevel = Math.max(0, Math.min(100, fillLevel));
    }
  }

  // Métodos para estadísticas
  async getUserStats(userId: string): Promise<UserStats | undefined> {
    return { ...this.userStats };
  }

  // Métodos para notificaciones
  async getNotificationsByUserId(userId: string): Promise<Notification[]> {
    return [...this.notifications];
  }

  async markNotificationAsRead(id: string): Promise<void> {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = 1;
    }
  }

  async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    const newNotification: Notification = {
      id: randomUUID(),
      ...notification,
      createdAt: new Date()
    };
    this.notifications.unshift(newNotification);
    return newNotification;
  }

  // Métodos dummy para usuarios (no necesarios para demo)
  async getUser(id: string): Promise<User | undefined> {
    return { id: "demo-user", username: "demo", password: "demo" };
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return { id: "demo-user", username: "demo", password: "demo" };
  }

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    return { id: randomUUID(), ...user };
  }
}

// Instancia única
export const storage = new SimpleStorage();