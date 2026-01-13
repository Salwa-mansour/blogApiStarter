
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require("uuid");
const prisma = require('../data/prismaClient');

const generateAndSendTokens = async (user, res) => {
  const jti = uuidv4();

  // Generate Tokens
  const accessToken = jwt.sign(
    { userId: user.id, jti },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { userId: user.id, jti },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  // Save JTI to DB
  await prisma.refreshToken.create({
    data: {
      id: jti,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  // Set Cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return accessToken;
};

module.exports = { generateAndSendTokens };