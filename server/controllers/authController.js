// Path: controllers/authController.js
const db = require("../data/accountData");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { generateAndSendTokens } = require("../utility/tokens");
const ROLES_LIST = require('../config/roles_list.js');
const { user } = require("../data/prismaClient");


// POST /signup
exports.signupAccount = async (req, res, next) => {
  const { userName, email, password ,confirmPassword} = req.body;

  try {
    // 1. Check if user already exists
    const existingUser = await db.findByEmail(email);
    const existingUserName = await db.findByUserName(userName);
    if (existingUserName) {
        return res.status(409).json({ 
          error: 'Username is already taken' 
        });
    }
     
    if (existingUser) {
      return res.status(409).json({ 
        error: 'Email is already registered' 
      });
    }
    if (password !== confirmPassword) {
      return res.status(422).json({ 
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
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    const user = await db.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // REUSE: Generate tokens and set cookie
    const accessToken = await generateAndSendTokens(user, res);

    res.json({ accessToken,
       auth: { 
            id: user.id,
            email: user.email,
            userRoles:user.roles
         //   roles:Object.keys(ROLES_LIST)
         } 
      });
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
exports.getAllUsers = async (req, res) => {
  try {
    const users = await db.allUsers();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: err.message });
  }

};

exports.refreshToken = async (req, res) => {
    // 1. Get the token from the cookie
    const token = req.cookies?.refreshToken;
    if (!token) return res.sendStatus(401);

    try {
        // 2. Verify the Refresh Token
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        // 3. Perform the Rotation in the Database
        // We send the old ID to delete it and create a new one
        const newTokenRecord = await db.rotateToken(decoded.jti, decoded.userId);

        if (!newTokenRecord) {
            return res.status(403).json({ message: "Invalid session" });
        }

        // 4. Generate NEW tokens using the NEW ID (jti) from the DB
        const newJti = newTokenRecord.id;

        const accessToken = jwt.sign(
            { userId: decoded.userId, jti: newJti, userRoles: decoded.userRoles },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15s' } // Standard time
        );

        const newRefreshToken = jwt.sign(
            { userId: decoded.userId, jti: newJti,userRoles: decoded.userRoles },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        // 5. Send the NEW cookie back to the browser
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true, // true in production
            sameSite: 'None',
            maxAge:  24 * 60 * 60 * 1000 // 1 day
        });

        // 6. Return the Access Token to the React frontend
        return res.json({ accessToken });

    } catch (err) {
        console.error("Refresh Error:", err.message);
        // If rotation fails or token is expired
        return res.sendStatus(403);
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