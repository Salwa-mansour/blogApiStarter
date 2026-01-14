const express = require('express');
const postRouter = express.Router();
const postController = require('../controllers/postContoller');
const auth = require('../middleware/authMiddleware');

postRouter.post('/myPosts',auth, postController.getMyPosts);

module.exports = postRouter;