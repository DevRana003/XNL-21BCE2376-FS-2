import { Router } from "express";
import { createChallenge, joinChallenge, updateProgress, getLeaderboard } from "../controllers/challenge.controller.js";
import { verifyjwt, checkRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create").post(verifyjwt, checkRole("Trainer", "Admin"), createChallenge);
router.route("/join").post(verifyjwt, joinChallenge);
router.route("/update-progress").patch(verifyjwt, updateProgress);
router.route("/leaderboard/:challengeId").get(verifyjwt, getLeaderboard);

export default router;
