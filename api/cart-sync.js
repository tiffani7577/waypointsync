import Pusher from "pusher";

export default async function handler(req, res) {
  // Allow CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.VITE_PUSHER_KEY,
      secret: process.env.PUSHER_SECRET,
      cluster: process.env.VITE_PUSHER_CLUSTER,
      useTLS: true,
    });

    await pusher.trigger("waypoint-cart", "cart-update", req.body);
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("[Pusher] trigger failed:", e);
    return res.status(500).json({ error: e.message });
  }
}
