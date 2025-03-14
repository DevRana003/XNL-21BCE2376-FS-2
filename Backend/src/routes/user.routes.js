import { Router } from "express";
import { registerUser , loginUser, logoutUser , refreshAccessToken, changeUserPassword, getCurrentUser, updateAccountDetails, changeUseravatar, getAdminDashboard, getTrainerSection} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import {checkRole, verifyjwt} from "../middlewares/auth.middleware.js"
import { validate } from "../middlewares/validate.middleware.js"
import { registerUserSchema, loginUserSchema, changePasswordSchema, updateAccountSchema } from "../utils/validations.js"
const router = Router();

router.route("/register").post
(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
    ]),
    validate(registerUserSchema), 
    registerUser
)
router.route("/login").post(validate(loginUserSchema),loginUser)

// secured routes 

router.route("/logout").post(verifyjwt,logoutUser)
router.route("/refresh-route").post(refreshAccessToken)
router.route("/change-password").post(verifyjwt,validate(changePasswordSchema),changeUserPassword)
router.route("/current-user").post(verifyjwt,getCurrentUser)
router.route("/update-account").patch(verifyjwt,validate(updateAccountSchema),updateAccountDetails)
router.route("/updateavtar").patch(verifyjwt,upload.single("avatar"),changeUseravatar)

// Role-Based Access Routes
router.route("/admin-dashboard").get(verifyjwt,checkRole("Admin"), getAdminDashboard)
router.route("/trainer-section").get(verifyjwt,checkRole("Trainer","Admin"), getTrainerSection)

export default router