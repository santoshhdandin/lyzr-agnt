require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

// Health check
app.get("/", (req, res) => res.send("Backend alive"));

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) return res.json({ reply: "No message sent" });

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
          session_id: "web-session",
          message: userMessage
        })
      }
    );

    const data = await response.json();

    res.json({ reply: data.response || "No reply from agent" });

  } catch (err) {
    console.error("Chat error:", err.message);
    res.status(500).json({ error: "Agent error" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on", PORT);
});
