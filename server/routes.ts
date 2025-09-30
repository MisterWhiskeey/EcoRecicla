import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
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
          streakDays: 0
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
          streakDays: streakDays || 0
        });
      } else {
        stats = await storage.updateUserStats(demoUserId, {
          totalKg,
          points,
          streakDays
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

  const httpServer = createServer(app);

  const wss = new WebSocketServer({ 
    server: httpServer,
    path: "/ws/containers"
  });

  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");

    const sendContainerUpdates = async () => {
      const containers = await storage.getAllContainers();
      ws.send(JSON.stringify({ type: "containers", data: containers }));
    };

    sendContainerUpdates();

    const interval = setInterval(async () => {
      const containers = await storage.getAllContainers();
      
      for (const container of containers) {
        if (Math.random() < 0.1) {
          const change = Math.floor(Math.random() * 10) - 3;
          const newLevel = Math.max(0, Math.min(100, container.fillLevel + change));
          await storage.updateContainerFillLevel(container.id, newLevel);
          
          if (newLevel >= 80 && container.fillLevel < 80) {
            await storage.createNotification({
              userId: demoUserId,
              containerId: container.id,
              message: `El contenedor ${container.name} está lleno (${newLevel}%). Te recomendamos buscar una alternativa cercana.`,
              read: 0
            });
          }
        }
      }
      
      sendContainerUpdates();
    }, 10000);

    ws.on("close", () => {
      console.log("WebSocket client disconnected");
      clearInterval(interval);
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      clearInterval(interval);
    });
  });

  return httpServer;
}
