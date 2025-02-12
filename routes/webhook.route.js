import { Router } from "express";
import { wenhookEvent } from "../controller/webhook.controller.js";

const webhookRouter = Router();

webhookRouter.post('/events', wenhookEvent)


export default webhookRouter;