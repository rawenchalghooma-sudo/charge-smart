const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc    Signup commun (user / owner / admin)
// @route   POST /api/auth/signup
// @access  Public
const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  if (!["user", "owner", "admin"].includes(role)) {
    res.status(400);
    throw new Error("Invalid role");
  }

  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    isActive: true,
  });

  res.status(201).json({
    message: "Account created successfully",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    },
  });
});

// fonction générique login par rôle
const loginByRole = (expectedRole) =>
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required");
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    if (user.role !== expectedRole) {
      res.status(403);
      throw new Error(`This account is not a ${expectedRole} account`);
    }

    if (!user.isActive) {
      res.status(403);
      throw new Error("Account is suspended");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    res.status(200).json({
      message: `${expectedRole} login successful`,
      token: generateToken(user),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  });

const loginUser = loginByRole("user");
const loginOwner = loginByRole("owner");
const loginAdmin = loginByRole("admin");

module.exports = {
  signup,
  loginUser,
  loginOwner,
  loginAdmin,
};