const router = require("express").Router();
const auth = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/signup", auth.signup);
router.post("/login", auth.login);
// Password reset (OTP) endpoints
router.post("/password/forgot", auth.requestOtp);
router.post("/password/reset", auth.verifyOtp);

// Profile & account management
router.get("/profile", authMiddleware, auth.getProfile);
router.put("/profile", authMiddleware, auth.updateProfile);
router.post("/change-password", authMiddleware, auth.changePassword);
router.post("/logout", authMiddleware, auth.logout);

module.exports = router;
