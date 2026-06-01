app.post("/orders", async (req, res) => {
  const orderData = req.body;

  console.log("Order received:", orderData);

  // Send to Kafka
  await producer.send({
    topic: "orders",
    messages: [
      { value: JSON.stringify(orderData) }
    ]
  });

  // Call Azure Function
  try {
    await fetch(FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    });

    console.log("Azure Function called successfully");
  } catch (error) {
    console.error("Azure Function call failed:", error.message);
  }

  res.status(200).json({
    message: "Order received",
    order: orderData
  });
});
app.listen(3000, () => {
  console.log("API running on port 3000");
});
