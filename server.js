import fs from 'fs';
import https from 'https';
import express from 'express';
import bodyParser from 'body-parser';
import { PORT, NODE_ENV } from './config/environment.js';
import messageRouter from './routes/message.route.js';
import webhookRouter from './routes/webhook.route.js';
import profileRouter from './routes/profile.route.js';

const app = express();

const options = {
    key: fs.readFileSync("C:/win-acme/certs/webhook.algosme.com-key.pem"),
    cert: fs.readFileSync("C:/win-acme/certs/webhook.algosme.com-crt.pem"),
};

// Middleware to parse JSON requests
app.use(bodyParser.json());

// CORS Middleware
app.use((req, res, next) => {
    const origin = req.headers.origin;

    // Check if the origin is from atlassian.net or its subdomains
    if (origin && origin.endsWith('.atlassian.net')) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true'); // If cookies/credentials are needed
    }

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
});

// Routes
app.use('/api/v1/messages', messageRouter);
app.use('/api/v1/webhook', webhookRouter);
app.use('/api/v1/profile', profileRouter);

app.get('/', (req, res) => {
    res.send(`Webhook v. 1.0.0`);
});

// Start the server
https.createServer(options, app).listen(PORT || 44301, () => {
    console.log(`Secure server running on port: ${PORT}`);
});