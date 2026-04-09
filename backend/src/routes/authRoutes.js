const express = require("express");
const router = express.Router();

const {
  signup,
  loginUser,
  loginOwner,
  loginAdmin,
} = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login/user", loginUser);
router.post("/login/owner", loginOwner);
router.post("/login/admin", loginAdmin);

module.exports = router;