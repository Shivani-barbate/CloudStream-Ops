const appInsights = require("applicationinsights");

appInsights
  .setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
  .setAutoCollectRequests(true)
  .setAutoCollectDependencies(true)
  .setAutoCollectExceptions(true)
  .setAutoCollectPerformance(true)
  .start();

const { EventProcessorClient } = require("@azure/event-hubs");
const {
  BlobCheckpointStore
} = require("@azure/eventhubs-checkpointstore-blob");
const {
  BlobServiceClient
} = require("@azure/storage-blob");
const { DefaultAzureCredential } = require("@azure/identity");
const axios = require("axios");

const functionUrl = process.env.FUNCTION_URL;

const storageAccount =
  process.env.STORAGE_ACCOUNT_NAME;

const containerName =
  process.env.STORAGE_CONTAINER_NAME;

const credential = new DefaultAzureCredential();

const blobServiceClient =
  new BlobServiceClient(
    `https://${storageAccount}.blob.core.windows.net`,
    credential
  );

const checkpointStore =
  new BlobCheckpointStore(
    blobServiceClient,
    containerName
  );

const processor =
  new EventProcessorClient(
    "$Default",
    "orders",
    "cloudstream-eh-ns.servicebus.windows.net",
    credential,
    checkpointStore
  );

console.log(
  "Worker started with Blob Checkpoint Store..."
);

processor.subscribe({

  processEvents: async (
    events,
    context
  ) => {

    for (const event of events) {

      try {

        console.log(
          "Processing order:",
          event.body
        );

        await axios.post(
          functionUrl,
          event.body
        );

        await context.updateCheckpoint(
          event
        );

        console.log(
          "Checkpoint updated"
        );

      } catch (err) {

        console.error(
          "Processing failed:",
          err.message
        );

      }

    }

  },

  processError: async (
    err
  ) => {

    console.error(
      "Event Processor Error:",
      err
    );

  }

});