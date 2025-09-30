import express from "express";
import { randomUUID } from "crypto";

// Simple in-memory storage
class MemStorage {
  constructor() {
    this.users = new Map();
    this.containers = new Map();
    this.userStats = new Map();
    this.notifications = new Map();
    this.seedContainers();
    this.seedDemoData();
  }

  seedDemoData() {
    const demoUserId = "demo-user";
    const statsId = randomUUID();
    this.userStats.set(statsId, {
      id: statsId,
      userId: demoUserId,
      totalKg: 45.5,
      points: 650,
      streakDays: 12,
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
        createdAt: new Date(Date.now() - 300000), // 5 min ago
      });

      const notif2Id = randomUUID();
      this.notifications.set(notif2Id, {
        id: notif2Id,
        userId: demoUserId,
        containerId: containers[1].id,
        message: "Contenedor medio lleno (65%). Aún puedes depositar aquí.",
        read: 0,
        createdAt: new Date(Date.now() - 3600000), // 1 hour ago
      });
    }
  }

  seedContainers() {
    const initialContainers = [
      {
        name: "Supermercado Esquina",
        latitude: -34.601722,
        longitude: -58.383592,
        fillLevel: 25,
        materials: ["Plástico", "Vidrio", "Papel"],
        address: "Av. Libertador 1234, Buenos Aires",
      },
      {
        name: "Farmacia Central",
        latitude: -34.607722,
        longitude: -58.379592,
        fillLevel: 65,
        materials: ["Plástico", "Latas"],
        address: "Av. Santa Fe 4567, Buenos Aires",
      },
      {
        name: "Plaza del Barrio",
        latitude: -34.593722,
        longitude: -58.391592,
        fillLevel: 40,
        materials: ["Papel", "Cartón"],
        address: "Av. Cabildo 890, Buenos Aires",
      },
      {
        name: "Centro Comercial",
        latitude: -34.585722,
        longitude: -58.401592,
        fillLevel: 15,
        materials: ["Plástico", "Vidrio", "Latas", "Papel"],
        address: "Calle Florida 2345, Buenos Aires",
      },
      {
        name: "Estación de Servicio",
        latitude: -34.635722,
        longitude: -58.351592,
        fillLevel: 90,
        materials: ["Orgánico", "Plástico"],
        address: "Av. Belgrano 6789, Buenos Aires",
      },
      {
        name: "Universidad Central",
        latitude: -34.611722,
        longitude: -58.375592,
        fillLevel: 40,
        materials: ["Papel", "Cartón", "Plástico"],
        address: "Av. Corrientes 3456, Buenos Aires",
      },
      {
        name: "Hospital San Juan",
        latitude: -34.600722,
        longitude: -58.385592,
        fillLevel: 75,
        materials: ["Vidrio", "Plástico"],
        address: "Av. Rivadavia 5678, Buenos Aires",
      },
      {
        name: "Parque Ecológico",
        latitude: -34.570722,
        longitude: -58.420592,
        fillLevel: 10,
        materials: ["Orgánico", "Papel", "Cartón"],
        address: "Av. Costanera Norte 9012, Buenos Aires",
      },
    ];

    initialContainers.forEach((container) => {
      const id = randomUUID();
      this.containers.set(id, { ...container, id });
    });
  }

  async getAllContainers() {
    return Array.from(this.containers.values());
  }

  async getContainer(id) {
    return this.containers.get(id);
  }

  async getUserStats(userId) {
    return Array.from(this.userStats.values()).find(
      (stats) => stats.userId === userId
    );
  }

  async createUserStats(insertStats) {
    const id = randomUUID();
    const stats = {
      id,
      userId: insertStats.userId,
      totalKg: insertStats.totalKg ?? 0,
      points: insertStats.points ?? 0,
      streakDays: insertStats.streakDays ?? 0,
    };
    this.userStats.set(id, stats);
    return stats;
  }

  async updateUserStats(userId, updates) {
    const stats = await this.getUserStats(userId);
    if (!stats) return undefined;
    const updated = { ...stats, ...updates };
    this.userStats.set(stats.id, updated);
    return updated;
  }

  async getUserNotifications(userId) {
    return Array.from(this.notifications.values())
      .filter((n) => n.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async markNotificationAsRead(id) {
    const notification = this.notifications.get(id);
    if (!notification) return undefined;
    const updated = { ...notification, read: 1 };
    this.notifications.set(id, updated);
    return updated;
  }
}

const storage = new MemStorage();

// Express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API routes
const demoUserId = "demo-user";

app.get("/api/containers", async (_req, res) => {
  try {
    const containers = await storage.getAllContainers();
    res.json(containers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch containers" });
  }
});

app.get("/api/containers/:id", async (req, res) => {
  try {
    const container = await storage.getContainer(req.params.id);
    if (!container) {
      return res.status(404).json({ error: "Container not found" });
    }
    res.json(container);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch container" });
  }
});

app.get("/api/stats", async (_req, res) => {
  try {
    let stats = await storage.getUserStats(demoUserId);
    if (!stats) {
      stats = await storage.createUserStats({
        userId: demoUserId,
        totalKg: 0,
        points: 0,
        streakDays: 0,
      });
    }
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

app.post("/api/stats/update", async (req, res) => {
  try {
    const { totalKg, points, streakDays } = req.body;
    
    if (totalKg !== undefined && (typeof totalKg !== "number" || totalKg < 0)) {
      return res.status(400).json({ error: "Invalid totalKg value" });
    }
    if (points !== undefined && (typeof points !== "number" || points < 0)) {
      return res.status(400).json({ error: "Invalid points value" });
    }
    if (streakDays !== undefined && (typeof streakDays !== "number" || streakDays < 0)) {
      return res.status(400).json({ error: "Invalid streakDays value" });
    }

    let stats = await storage.getUserStats(demoUserId);
    if (!stats) {
      stats = await storage.createUserStats({
        userId: demoUserId,
        totalKg: totalKg || 0,
        points: points || 0,
        streakDays: streakDays || 0,
      });
    } else {
      stats = await storage.updateUserStats(demoUserId, {
        totalKg,
        points,
        streakDays,
      });
    }
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to update stats" });
  }
});

app.get("/api/notifications", async (_req, res) => {
  try {
    const notifications = await storage.getUserNotifications(demoUserId);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

app.patch("/api/notifications/:id/read", async (req, res) => {
  try {
    const notification = await storage.markNotificationAsRead(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
});

// Export for Vercel
export default app;