import axios from 'axios';
import { LINE_API_ENDPOINT, LINE_CHANNEL_ACCESS_TOKEN } from "../config/environment.js";

/**
 * Generic function to fetch data from LINE API
 * @param {string} endpoint - The API endpoint (relative to LINE_API_ENDPOINT)
 * @param {Object} [params={}] - Query parameters for the request
 * @returns {Promise<Object>} - API response data
 */
const fetchFromLineApi = async (endpoint, params = {}) => {
    try {
        const response = await axios.get(`${LINE_API_ENDPOINT}${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
            },
            params
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch data from LINE API");
    }
};

/**
 * Fetch LINE follower IDs
 * @param {number} [limit=1000] - Number of IDs to fetch (max 1000)
 * @param {string} [start=''] - Pagination cursor
 * @returns {Promise<Object>} - API response containing follower IDs
 */
export const getFollowerIds = ({ limit = 1000, start = '' }, res) => {
    const params = { limit: limit || 1000, ...(start && { start }) };
    return fetchFromLineApi('/followers/ids', params);
};

/**
 * Fetch LINE user profile
 * @param {string} userId - LINE user ID
 * @returns {Promise<Object>} - User profile data
 */
export const getProfile = async (req, res) => {
    const userId = req.params.id
    if (!userId) {
        throw new Error("User ID is required to fetch profile.");
    }
    const response = await fetchFromLineApi(`/profile/${userId}`)
    return res.send(response);
};
