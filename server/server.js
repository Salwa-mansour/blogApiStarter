// Path: app.js

const express = require("express");

const cookieParser = require("cookie-parser"); // ADDED: To read refresh tokens from cookies
const cors = require("cors"); // ADDED: To allow your frontend to talk to the API
const authRouter = require("./routes/authRouter");
const categoryRouter = require("./routes/categoryRouter")
const postRouter = require("./routes/postRouter");

const app = express();


//app.use(cors({ origin: `http://localhost:${process.env.urlPORT || 3000}`, credentials: true })); // ADJUSTED: for frontend communication
app.use(express.json()); // ADJUSTED: To handle JSON API requests instead of form-data only
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // ADDED: Crucial for HttpOnly cookie security

app.use("/", authRouter);
app.use("/category",categoryRouter);
app.use("/posts",postRouter );

 //------------------end of routes--------------
app.use('/{*splat}', async (req, res) => {
    // *splat matches any path without the root path. If you need to match the root path as well /, you can use /{*splat}, wrapping the wildcard in braces.
    //res.sendFile(path.join(__dirname,'views','404.html'))
      res.status("404").json( { message: `path ${req.originalUrl} not found ` } );
  });
 
 const PORT = process.env.urlPORT || 3000;
 app.listen(PORT, (error) => {
   if (error) {
     throw error;
   }
   console.log(`Express app listening on port ${PORT}!`);
 });