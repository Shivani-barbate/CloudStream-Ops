const { DefaultAzureCredential } = require("@azure/identity");
const { BlobServiceClient } = require("@azure/storage-blob");
const { BlobCheckpointStore } = require("@azure/eventhubs-checkpointstore-blob");
const { EventProcessorClient } = require("@azure/event-hubs");
const axios = require("axios");

const credential = new DefaultAzureCredential();

const functionUrl = process.env.FUNCTION_URL;

const storageAccountName = "cloudstreamcheckpointsa";
const blobContainerName = "eventhub-checkpoints";

const blobServiceClient = new BlobServiceClient(
  `https://${storageAccountName}.blob.core.windows.net`,
  credential
);

const containerClient =
  blobServiceClient.getContainerClient(
    blobContainerName
  );

const checkpointStore =
  new BlobCheckpointStore(
    containerClient
  );

const processor =
  new EventProcessorClient(
    "$Default",
    "orders",
    "cloudstream-eh-ns.servicebus.windows.net",
    checkpointStore,
    credential
  );

console.log(
  "Worker started with Blob checkpointing..."
);

processor.subscribe({
  processEvents: async (
    events,
    context
  ) => {
    for (const event of events) {
      try {
        console.log(
          "📦 Processing order:",
          event.body
        );

        await axios.post(
          functionUrl,
          event.body
        );

        console.log(
          "✅ Azure Function invoked successfully"
        );

        await context.updateCheckpoint(
          event
        );

        console.log(
          "✅ Checkpoint updated"
        );

      } catch (err) {
        console.error(
          "❌ Processing failed:",
          err.message
        );
      }
    }
  },

  processError: async (
    err,
    context
  ) => {
    console.error(
      "❌ Event Processor Error:",
      err
    );
  }
});