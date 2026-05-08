import json
from confluent_kafka import Consumer
from config import KAFKA_BOOTSTRAP, KAFKA_GROUP, KAFKA_TOPIC


def get_consumer():
    consumer = Consumer({
        "bootstrap.servers": KAFKA_BOOTSTRAP,
        "group.id": KAFKA_GROUP,
        "auto.offset.reset": "earliest"
    })

    consumer.subscribe([KAFKA_TOPIC])
    return consumer


def poll_messages(batch_size=10):
    consumer = get_consumer()
    messages = []

    try:
        while len(messages) < batch_size:
            msg = consumer.poll(1.0)

            if msg is None:
                break

            if msg.error():
                continue

            payload = json.loads(msg.value().decode("utf-8"))
            messages.append(payload)

        consumer.commit()

    finally:
        consumer.close()

    return messages
