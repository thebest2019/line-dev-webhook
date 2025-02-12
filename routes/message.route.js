import { Router } from "express";
import { broadcastMessage, pushMessage } from "../controller/message.controller.js";

const messageRouter = Router();

messageRouter.post('/broadcast', broadcastMessage);
messageRouter.post('/push', pushMessage);

export default messageRouter;