const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();

// 🔐 HARD CORS HANDLER (no guessing)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://dandinsfarm.com");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Backend alive");
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.json({ reply: "Empty message" });
    }

    const response = await fetch(
      "https://agent-prod.studio.lyzr.ai/v3/inference/chat/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.LYZR_API_KEY
        },
        body: JSON.stringify({
          user_id: "website-user",
          agent_id: "6984cb662309e1f6b8e94f05",
          session_id: "website-session",
          message
        })
      }
    );

    const data = await response.json();
    res.json({ reply: data.response || "No reply" });

  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ reply: "Agent error" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on", PORT);
});
