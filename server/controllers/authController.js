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
      user: { id: user.id, username: user.username }
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