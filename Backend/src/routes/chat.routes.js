import { Router } from "express";
import { sendMessage, getChatHistory } from "../controllers/chat.controller.js";
import { verifyjwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/send").post(verifyjwt, sendMessage);
router.route("/history/:receiverId").get(verifyjwt, getChatHistory);

export default router;
