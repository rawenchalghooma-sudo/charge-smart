const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc    Signup commun (user / owner / admin)
// @route   POST /api/auth/signup
// @access  Public
const signup = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400);
      throw new Error("Please provide all required fields");
    }

    if (!["user", "owner", "admin"].includes(role)) {
      res.status(400);
      throw new Error("Invalid role");
    }

    const usersWithSameEmailAndRole = await User.findAll({
      where: { email, role },
    });

    for (const existingUser of usersWithSameEmailAndRole) {
      const samePassword = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (samePassword) {
        res.status(400);
        throw new Error(
          "An account with this email, role and password already exists"
        );
      }
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
  } catch (error) {
    console.log("SIGNUP ERROR:", error.message);
    console.log("MYSQL ERROR:", error.parent?.sqlMessage);
    console.log("MYSQL SQL:", error.parent?.sql);

    res.status(500).json({
      message: error.parent?.sqlMessage || error.message,
    });
  }
});

// fonction générique login par rôle
const loginByRole = (expectedRole) =>
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required");
    }

    const users = await User.findAll({
      where: { email, role: expectedRole },
    });

    if (!users || users.length === 0) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    let matchedUser = null;

    for (const user of users) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        matchedUser = user;
        break;
      }
    }

    if (!matchedUser) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    if (!matchedUser.isActive) {
      res.status(403);
      throw new Error("Account is suspended");
    }

    res.status(200).json({
      message: `${expectedRole} login successful`,
      token: generateToken(matchedUser),
      user: {
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        role: matchedUser.role,
        isActive: matchedUser.isActive,
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