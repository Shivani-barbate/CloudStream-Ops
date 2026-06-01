const { app } = require('@azure/functions');

app.http('orderNotification', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {

        context.log('📦 Order notification function triggered');

        const body = await request.json();

        const order = {
            orderId: body.orderId || "UNKNOWN",
            product: body.product || "UNKNOWN",
            price: body.price || 0,
            customer: body.customer || "Guest",
            status: "Processed"
        };

        context.log(`✅ Processing Order: ${JSON.stringify(order)}`);

        return {
            status: 200,
            jsonBody: {
                message: "Order processed successfully",
                environment: "DEV",
                timestamp: new Date().toISOString(),
                order
            }
        };
    }
});