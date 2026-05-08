import uuid
from azure.cosmos import CosmosClient
from config import (
    COSMOS_ENDPOINT,
    COSMOS_KEY,
    COSMOS_DATABASE,
    COSMOS_CONTAINER,
)

client = CosmosClient(COSMOS_ENDPOINT, credential=COSMOS_KEY)
database = client.get_database_client(COSMOS_DATABASE)
container = database.get_container_client(COSMOS_CONTAINER)


def save_document(doc):
    item = {
        "id": str(uuid.uuid4()),
        **doc
    }

    container.create_item(item)
    return item
