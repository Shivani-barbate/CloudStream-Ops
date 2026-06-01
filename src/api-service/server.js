const express = require("express");
const { Kafka } = require("kafkajs");

const app = express();
app.use(express.json());

const FUNCTION_URL = process.env.FUNCTION_URL;

const kafka = new Kafka({
  clientId: "cloudstream-api",
  brokers: ["kafka.kafka.svc.cluster.local:9092"]
});

const producer = kafka.producer();

(async () => {
  await producer.connect();
  console.log("Connected to Kafka");
})();

app.get("/health", (_, res) => {
  res.send("OK");
});

app.post("/orders", async (req, res) => {
  const orderData = req.body;

  console.log("📦 Order received:", orderData);

  // Send to Kafka
  await producer.send({
    topic: "orders",
    messages: [
      { value: JSON.stringify(orderData) }
    ]
  });

  // Call Azure Function
  try {
    await fetch(FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    });

    console.log("✅ Azure Function called successfully");
  } catch (error) {
    console.error("❌ Error calling Azure Function:", error);
  }

  res.status(202).json({
    status: "queued",
    message: "Order received and function triggered"
  });
});

app.listen(3000, () => {
  console.log("API running on port 3000");
});