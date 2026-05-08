const express = require("express");
const { Kafka } = require("kafkajs");

const app = express();
app.use(express.json());

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
  await producer.send({
    topic: "orders",
    messages: [
      { value: JSON.stringify(req.body) }
    ]
  });

  res.status(202).json({
    status: "queued"
  });
});

app.listen(3000, () => {
  console.log("API running on port 3000");
});
