import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import { storage } from "./simple-storage";

export async function registerRoutes(app: Express): Promise<Server> {
  const demoUserId = "demo-user";

  // Ruta para obtener contenedores
  app.get("/api/containers", async (_req, res) => {
    try {
      const containers = await storage.getAllContainers();
      res.json(containers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch containers" });
    }
  });

  // Ruta para obtener estadísticas
  app.get("/api/stats", async (_req, res) => {
    try {
      const stats = await storage.getUserStats(demoUserId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Ruta para obtener notificaciones
  app.get("/api/notifications", async (_req, res) => {
    try {
      const notifications = await storage.getNotificationsByUserId(demoUserId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  // Ruta para marcar notificación como leída
  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      await storage.markNotificationAsRead(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update notification" });
    }
  });

  // Crear servidor HTTP
  const server = createServer(app);

  // Configurar WebSocket para actualizaciones en tiempo real
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");

    // Enviar contenedores iniciales
    const sendContainerUpdates = async () => {
      const containers = await storage.getAllContainers();
      ws.send(JSON.stringify({ type: "containers", data: containers }));
    };

    sendContainerUpdates();

    // Simular actualizaciones automáticas cada 30 segundos
    const interval = setInterval(async () => {
      const containers = await storage.getAllContainers();
      
      // Simular cambios aleatorios en los niveles de llenado
      for (const container of containers) {
        if (Math.random() < 0.1) { // 10% probabilidad de cambio
          const change = Math.floor(Math.random() * 10) - 3; // -3 a +6
          const newLevel = Math.max(0, Math.min(100, container.fillLevel + change));
          await storage.updateContainerFillLevel(container.id, newLevel);
          
          // Crear notificación si se llena mucho
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

      // Enviar contenedores actualizados
      const updatedContainers = await storage.getAllContainers();
      ws.send(JSON.stringify({ type: "containers", data: updatedContainers }));
    }, 30000);

    ws.on("close", () => {
      console.log("WebSocket client disconnected");
      clearInterval(interval);
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      clearInterval(interval);
    });
  });

  return server;
}