const express = require('express');
const path = require('path');

const authRouter = express.Router();
const authController = require('../controllers/authController');

authRouter.post('/login', authController.loginPost);

authRouter.post('/refresh', async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    
    // Check DB to ensure JTI hasn't been revoked
    const dbToken = await prisma.refreshToken.findUnique({ where: { id: decoded.jti } });
    if (!dbToken) return res.sendStatus(403);

    // Optional: Rotate the token here (delete old, create new)
    const newAccessToken = jwt.sign(
        { sub: decoded.sub, role: decoded.role }, 
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: '15m' }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.sendStatus(403);
  }
});

module.exports = authRouter;