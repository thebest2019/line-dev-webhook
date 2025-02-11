const fs = require("fs");
const https = require("https");
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const options = {
    key: fs.readFileSync("C:/win-acme/certs/webhook.algosme.com-key.pem"),
    cert: fs.readFileSync("C:/win-acme/certs/webhook.algosme.com-crt.pem"),
};

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
https.createServer(options, app).listen(443, () => {
    console.log("Secure server running on https://webhook.algosme.com");
});
