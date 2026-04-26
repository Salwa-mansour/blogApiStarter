// Path: app.js

const express = require("express");
const serverless = require("serverless-http");
const cookieParser = require("cookie-parser"); // ADDED: To read refresh tokens from cookies
const cors = require("cors"); // ADDED: To allow your frontend to talk to the API
const authRouter = require("../../routes/authRouter");
const categoryRouter = require("../../routes/categoryRouter")
const postRouter = require("../../routes/postRouter");
const commentsRouter = require('../../routes/commentsRouter');
const app = express(); // 1. Create the main app instance
const router = express.Router(); // 2. Create a router instance


router.use(cors({ origin: `http://localhost:${process.env.urlPORT || 3000}`, credentials: true })); // ADJUSTED: for frontend communication
router.use(express.json()); // ADJUSTED: To handle JSON API requests instead of form-data only
router.use(express.urlencoded({ extended: false }));
router.use(cookieParser()); // ADDED: Crucial for HttpOnly cookie security

router.use("/", authRouter);
router.use("/category",categoryRouter);
router.use("/posts",postRouter );
router.use('/posts/:postId/comments',commentsRouter);

 //------------------end of routes--------------
// Standard Express catch-all for 404s
router.use((req, res) => {
    res.status(404).json({ message: `Path ${req.originalUrl} not found` });
});

// Tell Express to use this router for the Netlify function path
app.use("/api", router);
// The CRITICAL export for Netlify
const handler = serverless(app);
module.exports.handler = async (event, context) => {
  // This wrapper ensures any background tasks or database 
  // connections are handled properly before the function freezes
  return await handler(event, context);
};