const express = require("express");
const { EventHubProducerClient } = require("@azure/event-hubs");
const { DefaultAzureCredential } = require("@azure/identity");
const axios = require("axios");

const app = express();
app.use(express.json());

const FUNCTION_URL = process.env.FUNCTION_URL;

const credential = new DefaultAzureCredential();

const producer = new EventHubProducerClient(
  "cloudstream-eh-ns.servicebus.windows.net",
  "orders",
  credential
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

    try {
      await axios.post(
        FUNCTION_URL,
        orderData
      );

      console.log(
        "✅ Azure Function called successfully"
      );
    } catch (funcErr) {
      console.error(
        "❌ Azure Function call failed:",
        funcErr.message
      );
    }

    res.status(200).json({
      success: true,
      message: "Order submitted successfully"
    });

  } catch (err) {
    console.error(
      "❌ Event Hub error:",
      err
    );

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `API running on port ${PORT}`
  );
});