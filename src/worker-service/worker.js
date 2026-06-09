const { EventHubConsumerClient } = require("@azure/event-hubs");
const axios = require("axios");
const fs = require("fs");

let connectionString;

try {
  connectionString = fs
    .readFileSync(
      "/mnt/secrets-store/eventhub-connection-string",
      "utf8"
    )
    .trim();

  console.log("Using Event Hub connection string from Key Vault");
} catch (err) {
  connectionString =
    process.env.EVENTHUB_CONNECTION_STRING;

  console.log("Using Event Hub connection string from Kubernetes Secret");
}

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