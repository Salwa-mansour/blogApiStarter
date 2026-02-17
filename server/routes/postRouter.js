const express = require('express');
const postRouter = express.Router();
const postController = require('../controllers/postContoller');
const auth = require('../middleware/authMiddleware');
const ROLES_LIST = require('../config/roles_list.js');
const verifyRoles = require('../middleware/verifyRoles');

postRouter.get('/', postController.getPosts);
postRouter.get('/:id',postController.postData);
postRouter.get('/myposts', auth, postController.getMyPosts);
postRouter.post('/publish', auth, verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.EDITOR), postController.createPost);
postRouter.put('/:id', auth, verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.EDITOR), postController.updatePost);
postRouter.delete('/:id', auth, verifyRoles(ROLES_LIST.ADMIN), postController.deletePost);
module.exports = postRouter;