const fs = require("fs");
const https = require("https");
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();

const options = {
    key: fs.readFileSync("C:/win-acme/certs/webhook.algosme.com-key.pem"),
    cert: fs.readFileSync("C:/win-acme/certs/webhook.algosme.com-crt.pem"),
};

const CHANNEL_ACCESS_TOKEN = '6LPZ12PnkjMfA6km3JPkltK8bRr53k4mqsFLQwf6OR8D3dhGQ7sXeQQvdyhw1Ze0HQUkSlkYGhtB6uvH8fsaUbS8WyvEMSdvk49yYNX9AsRnxe1k8xGiyPEu139efwSxHGnU6Di75pVsLmDpWBYbxQdB04t89/1O/w1cDnyilFU=';

// Middleware to parse JSON requests
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send(`Webhook v. 1.0.0 [${uuidv4()}]`);
});

// Webhook endpoint
app.post('/webhook', (req, res) => {
    console.log('Received webhook:', req.body);
    // Respond to acknowledge receipt
    res.status(200).json({
        success: true,
        payload: req.body,
        header: JSON.stringify(req.header)
    });
});

app.post('message/send', async (req, res) => {
    const messages = req.body.messages;
    const retryKey = uuidv4();

    if (!messages) {
        res.status(400).json({
            success: false,
            message: "Invalid message payload.",
            error: null
        });
    }

    try {
        const response = await axios.post(
            "https://api.line.me/v2/bot/message/broadcast",
            { messages },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${CHANNEL_ACCESS_TOKEN}`,
                    "X-Line-Retry-Key": retryKey,
                },
            }
        );

        res.status(200).json({
            success: true,
            message: "Broadcast message sent successfully",
            data: response.data
        });
    } catch (error) {
        console.error("Error sending broadcast message:", error.response ? error.response.data : error.message);
        res.status(500).json({
            success: false,
            message: "Failed to send broadcast message",
            error: error.response ? error.response.data : error.message,
        });
    }
});

// Start the server
// app.listen(8080, () => {
//     console.log('server started at port 8080');
// })
https.createServer(options, app).listen(443, () => {
    console.log("Secure server running on https://webhook.algosme.com");
});
