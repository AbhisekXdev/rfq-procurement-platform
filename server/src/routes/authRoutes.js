import { Router } from "express";
import {
  registerUser,
  verifyRegistrationOtp,
  resendRegistrationOtp,
  loginUser,
  verifyLoginOtp,
  resendLoginOtp,
} from "../controllers/authController.js";
import { handleValidationErrors } from "../middleware/validationMiddleware.js";
import { registerValidator } from "../validators/registerValidator.js";
import { loginValidator } from "../validators/loginValidator.js";

const router = Router();

router.post("/register", registerValidator, handleValidationErrors, registerUser);
router.post("/register/verify-otp", verifyRegistrationOtp);
router.post("/register/resend-otp", resendRegistrationOtp);
router.post("/login", loginValidator, handleValidationErrors, loginUser);
router.post("/login/verify-otp", verifyLoginOtp);
router.post("/login/resend-otp", resendLoginOtp);

export default router;
