import { 
  type User, 
  type InsertUser,
  type Container,
  type InsertContainer,
  type UserStats,
  type InsertUserStats,
  type Notification,
  type InsertNotification
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllContainers(): Promise<Container[]>;
  getContainer(id: string): Promise<Container | undefined>;
  createContainer(container: InsertContainer): Promise<Container>;
  updateContainerFillLevel(id: string, fillLevel: number): Promise<Container | undefined>;
  
  getUserStats(userId: string): Promise<UserStats | undefined>;
  createUserStats(stats: InsertUserStats): Promise<UserStats>;
  updateUserStats(userId: string, stats: Partial<InsertUserStats>): Promise<UserStats | undefined>;
  
  getUserNotifications(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<Notification | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private containers: Map<string, Container>;
  private userStats: Map<string, UserStats>;
  private notifications: Map<string, Notification>;

  constructor() {
    this.users = new Map();
    this.containers = new Map();
    this.userStats = new Map();
    this.notifications = new Map();
    
    this.seedContainers();
    this.seedDemoData();
  }
  
  private seedDemoData() {
    const demoUserId = "demo-user";
    
    const statsId = randomUUID();
    this.userStats.set(statsId, {
      id: statsId,
      userId: demoUserId,
      totalKg: 45.5,
      points: 650,
      streakDays: 12
    });
    
    const containers = Array.from(this.containers.values());
    if (containers.length > 2) {
      const notif1Id = randomUUID();
      this.notifications.set(notif1Id, {
        id: notif1Id,
        userId: demoUserId,
        containerId: containers[2].id,
        message: "El contenedor está lleno (90%). Te recomendamos buscar una alternativa cercana.",
        read: 0,
        createdAt: new Date(Date.now() - 300000)
      });
      
      const notif2Id = randomUUID();
      this.notifications.set(notif2Id, {
        id: notif2Id,
        userId: demoUserId,
        containerId: containers[1].id,
        message: "Contenedor medio lleno (65%). Aún puedes depositar aquí.",
        read: 0,
        createdAt: new Date(Date.now() - 3600000)
      });
    }
  }

  private seedContainers() {
    const initialContainers: InsertContainer[] = [
      {
        name: "Supermercado Esquina", // MUY CERCA - 0.2km
        latitude: -34.601722,
        longitude: -58.383592,
        fillLevel: 25,
        materials: ["Plástico", "Vidrio", "Papel"],
        address: "Av. Libertador 1234, Buenos Aires"
      },
      {
        name: "Farmacia Central", // CERCA - 0.5km
        latitude: -34.607722,
        longitude: -58.379592,
        fillLevel: 65,
        materials: ["Plástico", "Latas"],
        address: "Av. Santa Fe 4567, Buenos Aires"
      },
      {
        name: "Plaza del Barrio", // MEDIO - 1.2km
        latitude: -34.593722,
        longitude: -58.391592,
        fillLevel: 40,
        materials: ["Papel", "Cartón"],
        address: "Av. Cabildo 890, Buenos Aires"
      },
      {
        name: "Centro Comercial", // LEJOS - 2.1km
        latitude: -34.585722,
        longitude: -58.401592,
        fillLevel: 15,
        materials: ["Plástico", "Vidrio", "Latas", "Papel"],
        address: "Calle Florida 2345, Buenos Aires"
      },
      {
        name: "Estación de Servicio", // MUY LEJOS - 3.5km
        latitude: -34.635722,
        longitude: -58.351592,
        fillLevel: 90,
        materials: ["Orgánico", "Plástico"],
        address: "Av. Belgrano 6789, Buenos Aires"
      },
      {
        name: "Universidad Central", // MEDIO-CERCA - 0.8km
        latitude: -34.611722,
        longitude: -58.375592,
        fillLevel: 40,
        materials: ["Papel", "Cartón", "Plástico"],
        address: "Av. Corrientes 3456, Buenos Aires"
      },
      {
        name: "Hospital San Juan", // CERCA - 0.4km
        latitude: -34.600722,
        longitude: -58.385592,
        fillLevel: 75,
        materials: ["Vidrio", "Plástico"],
        address: "Av. Rivadavia 5678, Buenos Aires"
      },
      {
        name: "Parque Ecológico", // LEJOS - 4.2km
        latitude: -34.570722,
        longitude: -58.420592,
        fillLevel: 10,
        materials: ["Orgánico", "Papel", "Cartón"],
        address: "Av. Costanera Norte 9012, Buenos Aires"
      }
    ];

    initialContainers.forEach(container => {
      const id = randomUUID();
      this.containers.set(id, { ...container, id });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllContainers(): Promise<Container[]> {
    return Array.from(this.containers.values());
  }

  async getContainer(id: string): Promise<Container | undefined> {
    return this.containers.get(id);
  }

  async createContainer(insertContainer: InsertContainer): Promise<Container> {
    const id = randomUUID();
    const container: Container = { ...insertContainer, id };
    this.containers.set(id, container);
    return container;
  }

  async updateContainerFillLevel(id: string, fillLevel: number): Promise<Container | undefined> {
    const container = this.containers.get(id);
    if (!container) return undefined;
    
    const updated = { ...container, fillLevel };
    this.containers.set(id, updated);
    return updated;
  }

  async getUserStats(userId: string): Promise<UserStats | undefined> {
    return Array.from(this.userStats.values()).find(
      (stats) => stats.userId === userId
    );
  }

  async createUserStats(insertStats: InsertUserStats): Promise<UserStats> {
    const id = randomUUID();
    const stats: UserStats = { 
      id,
      userId: insertStats.userId,
      totalKg: insertStats.totalKg ?? 0,
      points: insertStats.points ?? 0,
      streakDays: insertStats.streakDays ?? 0
    };
    this.userStats.set(id, stats);
    return stats;
  }

  async updateUserStats(userId: string, updates: Partial<InsertUserStats>): Promise<UserStats | undefined> {
    const stats = await this.getUserStats(userId);
    if (!stats) return undefined;
    
    const updated = { ...stats, ...updates };
    this.userStats.set(stats.id, updated);
    return updated;
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(n => n.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = randomUUID();
    const notification: Notification = { 
      id,
      userId: insertNotification.userId,
      containerId: insertNotification.containerId,
      message: insertNotification.message,
      read: insertNotification.read ?? 0,
      createdAt: new Date()
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async markNotificationAsRead(id: string): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (!notification) return undefined;
    
    const updated = { ...notification, read: 1 };
    this.notifications.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
