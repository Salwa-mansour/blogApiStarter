// Path: controllers/authController.js
const db = require("../data/accountData");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { generateAndSendTokens } = require("../utility/tokens");

// POST /signup
exports.signupAccount = async (req, res, next) => {
  const { userName, email, password ,confirmPassword} = req.body;
 // console.log(req.body)
  try {
    // 1. Check if user already exists
    const existingUser = await db.findByEmail(email);
    const existingUserName = await db.findByUserName(userName);
    if (existingUserName) {
        return res.status(400).json({ 
          error: 'Username is already taken' 
        });
    }
     
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Email is already registered' 
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ 
        error: 'Passwords do not match' 
      });
    }
    // 2. Create the user in the database
    // (Ensure your db.createUser hashes the password before saving!)
    const user = await db.createUser({ userName, email, password });

// REUSE: Generate tokens and set cookie
    const accessToken = await generateAndSendTokens(user, res);

    return res.status(201).json({
      message: "User created and logged in",
      accessToken,
      user: { id: user.id, username: user.userName }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.loginPost = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // REUSE: Generate tokens and set cookie
    const accessToken = await generateAndSendTokens(user, res);

    res.json({ accessToken, user: { id: user.id, email: user.email,roles:user.roles } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    const decoded = jwt.decode(refreshToken);
    if (decoded?.jti) {
      // Delete the refresh token from the database
    await  db.deleteToken(decoded.jti);
    }
  }
  res.clearCookie('refreshToken');
  res.status(200).json({ message: "Logged out" });
};

 exports.refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken; // Read the HttpOnly cookie
  if (!token) return res.sendStatus(401);

  try {
    // 1. Verify the refresh token signature
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    // 2. Check if the 'jti' (token ID) still exists in our Postgres DB
    const dbToken =await db.findToken(decoded.jti);

    if (!dbToken) {
      // If the JTI is missing, the session was revoked or is a replay attack
      return res.status(403).json({ message: "Session expired or revoked" });
    }

    // 3. Issue a new Access Token
    const newToken = jwt.sign(
      { userId: decoded.userId, jti: decoded.jti }, 
      process.env.ACCESS_TOKEN_SECRET, 
      { expiresIn: "15m" }
    );

    await db.rotateToken(decoded.jti, decoded.userId, newToken);
   
    res.json({ accessToken:newToken });
  } catch (err) {
    res.sendStatus(403);
  }
};
exports.updateUserRoles = async (req, res) => {
    // Both are now "hidden" in the JSON body
    const { userId, newRoles } = req.body; 
    // Prevent admin from removing their own admin role
    if (Number(userId) === req.user.userId && !newRoles.includes("ADMIN")) {
        return res.status(400).json({ message: "You cannot remove your own Admin role." });
    }
    try {
        // 1. Validation
        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }
        if (!Array.isArray(newRoles) || newRoles.length === 0) {
            return res.status(400).json({ message: "Roles must be a non-empty array." });
        }

        // 2. Role Validity Check
        const validRoles = Object.keys(ROLES_LIST);
        const isValid = newRoles.every(role => validRoles.includes(role));
        if (!isValid) {
            return res.status(400).json({ message: "Invalid role detected." });
        }

       const updatedUser = await db.updateUserRoles(userId, newRoles);

        res.json({ message: "Update successful", user: updatedUser });

    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ message: "User not found" });
        res.status(500).json({ message: "Internal server error" });
    }
};