import azure.functions as func
import logging
from main import run_processor

app = func.FunctionApp()


@app.timer_trigger(
    schedule="*/15 * * * * *",
    arg_name="timer",
    run_on_startup=False
)
def process_orders(timer: func.TimerRequest):
    logging.info("Polling Kafka...")
    run_processor()
