import os

KAFKA_BOOTSTRAP = os.getenv("KAFKA_BOOTSTRAP", "kafka.kafka.svc.cluster.local:9092")
KAFKA_TOPIC = os.getenv("KAFKA_TOPIC", "orders")
KAFKA_GROUP = os.getenv("KAFKA_GROUP", "processor-group")

COSMOS_ENDPOINT = os.getenv("COSMOS_ENDPOINT")
COSMOS_KEY = os.getenv("COSMOS_KEY")
COSMOS_DATABASE = os.getenv("COSMOS_DATABASE", "cloudstream")
COSMOS_CONTAINER = os.getenv("COSMOS_CONTAINER", "orders")
