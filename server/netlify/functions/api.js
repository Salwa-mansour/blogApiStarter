// Path: app.js

const express = require("express");
const serverless = require("serverless-http");
const cookieParser = require("cookie-parser"); // ADDED: To read refresh tokens from cookies
const cors = require("cors"); // ADDED: To allow your frontend to talk to the API
const authRouter = require("../../routes/authRouter");
const categoryRouter = require("../../routes/categoryRouter")
const postRouter = require("../../routes/postRouter");
const commentsRouter = require('../../routes/commentsRouter');

const app = express();


app.use(cors({ origin: `http://localhost:${process.env.urlPORT || 3000}`, credentials: true })); // ADJUSTED: for frontend communication
app.use(express.json()); // ADJUSTED: To handle JSON API requests instead of form-data only
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // ADDED: Crucial for HttpOnly cookie security

app.use("/", authRouter);
app.use("/category",categoryRouter);
app.use("/posts",postRouter );
app.use('/posts/:postId/comments',commentsRouter);

 //------------------end of routes--------------
// Standard Express catch-all for 404s
app.use((req, res) => {
    res.status(404).json({ message: `Path ${req.originalUrl} not found` });
});

// The CRITICAL export for Netlify
const handler = serverless(app);
module.exports.handler = async (event, context) => {
  // This wrapper ensures any background tasks or database 
  // connections are handled properly before the function freezes
  return await handler(event, context);
};