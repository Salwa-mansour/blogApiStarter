// Path: controllers/authController.js
const db = require("../data/accountData");
const bcrypt = require("bcryptjs");
const { generateAndSendTokens } = require("../utility/tokens");

// POST /signup
exports.signupAccount = async (req, res, next) => {
  const { userName, email, password ,confirmPassword} = req.body;
 // console.log(req.body)
  try {
    // 1. Check if user already exists
    const existingUser = await db.findByEmail(email);

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

    res.json({ accessToken, user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// export const logout = async (req, res) => {
//   const refreshToken = req.cookies.refreshToken;
//   if (refreshToken) {
//     const decoded = jwt.decode(refreshToken);
//     if (decoded?.jti) {
//       await prisma.refreshToken.deleteMany({ where: { id: decoded.jti } });
//     }
//   }
//   res.clearCookie('refreshToken');
//   res.json({ message: "Logged out" });
// };
// Path: controllers/authController.js

// exports.refreshToken = async (req, res) => {
//   const token = req.cookies.refreshToken; // Read the HttpOnly cookie
//   if (!token) return res.sendStatus(401);

//   try {
//     // 1. Verify the refresh token signature
//     const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

//     // 2. Check if the 'jti' (token ID) still exists in our Postgres DB
//     const dbToken = await prisma.refreshToken.findUnique({
//       where: { id: decoded.jti }
//     });

//     if (!dbToken) {
//       // If the JTI is missing, the session was revoked or is a replay attack
//       return res.status(403).json({ message: "Session expired or revoked" });
//     }

//     // 3. Issue a new Access Token
//     const accessToken = jwt.sign(
//       { userId: decoded.userId, jti: decoded.jti }, 
//       process.env.ACCESS_TOKEN_SECRET, 
//       { expiresIn: "15m" }
//     );

//     res.json({ accessToken });
//   } catch (err) {
//     res.sendStatus(403);
//   }
// };