const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 44301;

// Middleware to parse JSON requests
app.use(bodyParser.json());

app.get('/', (req,res) => {
 res.send('Webhook v. 1.0.0');
});

// Webhook endpoint
app.post('/webhook', (req, res) => {
    console.log('Received webhook:', req.body);
    // Respond to acknowledge receipt
    res.status(200).json({
        success: true,
        payload: req.body,
        header:  JSON.stringify(req.header)
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Webhook API is running on http://localhost:${PORT}`);
});
