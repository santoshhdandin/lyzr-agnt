import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

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

    res.json({
      reply: data.response || "No reply"
    });

  } catch (err) {
    res.status(500).json({ error: "Agent error" });
  }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});
