import { Router } from "express";
import { getFollowerIds } from "../controller/profile.controller.js";
import { getProfile } from "../controller/profile.controller.js";

const profileRouter = Router();

profileRouter.get('/all', getFollowerIds)
profileRouter.get('/:id', getProfile)


export default profileRouter;