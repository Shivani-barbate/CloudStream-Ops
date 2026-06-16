const appInsights = require("applicationinsights");

appInsights
  .setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
  .setAutoCollectRequests(true)
  .setAutoCollectDependencies(true)
  .setAutoCollectExceptions(true)
  .setAutoCollectPerformance(true)
  .start();

const { EventHubConsumerClient } = require("@azure/event-hubs");
const { DefaultAzureCredential } = require("@azure/identity");
const axios = require("axios");

const functionUrl = process.env.FUNCTION_URL;

const credential = new DefaultAzureCredential();

const consumer = new EventHubConsumerClient(
  "$Default",
  "cloudstream-eh-ns.servicebus.windows.net",
  "orders",
  credential
);

console.log("Worker started. Listening for orders...");

consumer.subscribe({
  processEvents: async (events) => {
    for (const event of events) {
      try {
        console.log("Processing order:", event.body);

        await axios.post(
          functionUrl,
          event.body
        );

        console.log(
          "Azure Function invoked successfully"
        );
      } catch (err) {
        console.error(
          "Processing failed:",
          err.message
        );
      }
    }
  },

  processError: async (err) => {
    console.error(
      "Event Hub consumer error:",
      err
    );
  }
});