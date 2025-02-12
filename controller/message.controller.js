import { v4 as uuidv4 } from 'uuid';
import { LINE_API_ENDPOINT, LINE_CHANNEL_ACCESS_TOKEN } from '../config/environment.js';
import axios from 'axios';

/**
 * Helper function to send a message request to LINE API.
 * @param {string} endpoint - The LINE API endpoint (e.g., '/message/broadcast' or '/message/push').
 * @param {Object} payload - The request payload.
 * @param {Object} res - The Express response object.
 */
const sendMessage = async (endpoint, payload, res) => {
    try {
        const retryKey = uuidv4();
        const { data } = await axios.post(
            `${LINE_API_ENDPOINT}${endpoint}`,
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
                    "X-Line-Retry-Key": retryKey,
                },
            }
        );

        return res.status(200).json({
            success: true,
            message: "Message sent successfully",
            data
        });
    } catch (error) {
        console.error("Error sending message:", error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to send message",
            error: error.response?.data || error.message,
        });
    }
};

/**
 * Broadcast message to all LINE users.
 */
export const broadcastMessage = async (req, res) => {
    const { messages } = req.body;
    
    if (!messages?.length) {
        return res.status(400).json({ success: false, message: "Invalid message payload." });
    }

    return sendMessage('/message/broadcast', { messages }, res);
};

/**
 * Push message to a specific LINE user.
 */
export const pushMessage = async (req, res) => {
    const { messages, to } = req.body;
    
    if (!messages?.length) {
        return res.status(400).json({ success: false, message: "Invalid message payload." });
    }

    if (!to) {
        return res.status(400).json({ success: false, message: "Invalid 'to' parameter." });
    }

    return sendMessage('/message/push', { to, messages }, res);
};
