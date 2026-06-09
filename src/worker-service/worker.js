const { EventHubConsumerClient } = require("@azure/event-hubs");
const axios = require("axios");
const fs = require("fs");

const connectionString = fs
  .readFileSync(
    "/mnt/secrets-store/eventhub-connection-string",
    "utf8"
  )
  .trim();

const functionUrl =
  process.env.FUNCTION_URL;

const consumer = new EventHubConsumerClient(
  "$Default",
  connectionString,
  "orders"
);

console.log("Worker started. Listening for orders...");

consumer.subscribe({
  processEvents: async (events) => {
    for (const event of events) {
      try {
        console.log("📦 Processing order:", event.body);

        await axios.post(
          functionUrl,
          event.body
        );

        console.log(
          "✅ Azure Function invoked successfully"
        );
      } catch (err) {
        console.error(
          "❌ Processing failed:",
          err.message
        );
      }
    }
  },

  processError: async (err) => {
    console.error(
      "❌ Event Hub consumer error:",
      err
    );
  }
});