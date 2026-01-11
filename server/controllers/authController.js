// Path: controllers/authController.js

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const { v4: uuidv4 } = require("uuid");
const prisma = new PrismaClient();

// MODIFIED: From rendering a page to returning JSON + HttpOnly Cookie
exports.loginPost = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const jti = uuidv4(); // Generate unique ID for this session

    // Generate Short-lived Access Token (15m)
    const accessToken = jwt.sign(
      { userId: user.id, jti }, 
      process.env.ACCESS_TOKEN_SECRET, 
      { expiresIn: "15m" }
    );

    // Generate Long-lived Refresh Token (7d)
    const refreshToken = jwt.sign(
      { userId: user.id, jti }, 
      process.env.REFRESH_TOKEN_SECRET, 
      { expiresIn: "7d" }
    );

    // ADDED: Save jti to DB to allow for later revocation
    await prisma.refreshToken.create({
      data: {
        id: jti,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
    });

    // ADJUSTED: Send refresh token in a secure cookie, and access token in JSON
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken, user: { id: user.id, username: user.username } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};