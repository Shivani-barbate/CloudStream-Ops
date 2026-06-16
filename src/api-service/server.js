const appInsights = require("applicationinsights");

appInsights
  .setup(
    process.env.APPLICATIONINSIGHTS_CONNECTION_STRING
  )
  .setAutoCollectRequests(true)
  .setAutoCollectDependencies(true)
  .setAutoCollectExceptions(true)
  .setAutoCollectPerformance(true)
  .start();

const express = require("express");
const { EventHubProducerClient } = require("@azure/event-hubs");
const { DefaultAzureCredential } = require("@azure/identity");


const app = express();
app.use(express.json());

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

  console.log("Order received:", orderData);

  try {
    const batch = await producer.createBatch();

    batch.tryAdd({
      body: orderData
    });

    await producer.sendBatch(batch);

    console.log("Event Hub message sent");

    res.status(200).json({
      success: true,
      message: "Order submitted successfully"
    });

  } catch (err) {
    console.error("Event Hub error:", err);

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});