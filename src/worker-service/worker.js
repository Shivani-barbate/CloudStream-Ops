const { Kafka } = require("kafkajs");
const axios = require("axios");

const kafka = new Kafka({
  clientId: "worker-service",
  brokers: ["kafka.kafka.svc.cluster.local:9092"]
});

const consumer = kafka.consumer({
  groupId: "order-processors"
});

const FUNCTION_URL =
  process.env.FUNCTION_URL ||
  "https://cloudstream-order-function.azurewebsites.net/api/orderNotification";

async function start() {
  await consumer.connect();

  await consumer.subscribe({
    topic: "orders",
    fromBeginning: true
  });

  console.log("Worker started. Listening for orders...");

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const order = JSON.parse(message.value.toString());

        console.log("📦 Processing order:", order);

        await axios.post(FUNCTION_URL, order);

        console.log("✅ Azure Function invoked successfully");
      } catch (error) {
        console.error("❌ Processing failed:", error.message);
      }
    }
  });
}

start().catch(console.error);