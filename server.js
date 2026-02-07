const express = require("express");
require("dotenv").config();

const app = express();

app.get("/", (req, res) => {
  res.send("Backend is alive");
});

app.post("/chat", express.json(), async (req, res) => {
  res.json({ reply: "Test OK" });
});

const PORT = process.env.PORT;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on", PORT);
});
