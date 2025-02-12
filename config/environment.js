import { config } from "dotenv";

config( { path: `.env.${process.env.NODE_ENV || 'development'}` });

export const { 
    PORT, NODE_ENV, 
    LINE_API_ENDPOINT, LINE_CHANNEL_ACCESS_TOKEN 
} = process.env;
