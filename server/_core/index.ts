import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

// ── Cart sync state (in-memory, single-server) ──────────────────────────────
let latestCartState: unknown = null;
const displayClients = new Set<import('http').ServerResponse>();

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // ── Cart sync: POS pushes state, Display subscribes via SSE ────────────────
  // POST /api/cart-sync  — called by POS whenever cart changes
  app.post("/api/cart-sync", (req, res) => {
    latestCartState = req.body;
    // Broadcast to all connected display clients
    for (const client of Array.from(displayClients)) {
      try {
        client.write(`data: ${JSON.stringify(latestCartState)}\n\n`);
      } catch {
        displayClients.delete(client);
      }
    }
    res.json({ ok: true });
  });

  // GET /api/cart-stream — SSE endpoint for CustomerDisplay
  app.get("/api/cart-stream", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.flushHeaders();

    // Send current state immediately on connect
    if (latestCartState) {
      res.write(`data: ${JSON.stringify(latestCartState)}\n\n`);
    }

    displayClients.add(res);

    // Keep-alive ping every 25s
    const ping = setInterval(() => {
      try { res.write(": ping\n\n"); } catch { clearInterval(ping); }
    }, 25000);

    req.on("close", () => {
      clearInterval(ping);
      displayClients.delete(res);
    });
  });
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
