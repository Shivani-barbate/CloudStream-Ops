import logging
from consumer import poll_messages
from cosmos_client import save_document


def run_processor():
    messages = poll_messages()

    for msg in messages:
        saved = save_document(msg)
        logging.info(f"Saved document: {saved['id']}")
