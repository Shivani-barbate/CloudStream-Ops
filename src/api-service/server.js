const express = require("express");
const { EventHubProducerClient } = require("@azure/event-hubs");

const app = express();
app.use(express.json());

const FUNCTION_URL = process.env.FUNCTION_URL;

const producer = new EventHubProducerClient(
  process.env.EVENTHUB_CONNECTION_STRING,
  "orders"
);

app.get("/health", (_, res) => {
  res.send("OK");
});

app.post("/orders", async (req, res) => {
  const orderData = req.body;

  console.log("📦 Order received:", orderData);

  try {
    const batch = await producer.createBatch();

    batch.tryAdd({
      body: orderData
    });

    await producer.sendBatch(batch);

    console.log("✅ Event Hub message sent");
  } catch (err) {
    console.error("❌ Event Hub error:", err);
    return res.status(500).json({
      error: "Failed to publish event"
    });
  }

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