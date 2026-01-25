const express = require('express');
const postRouter = express.Router();
const postController = require('../controllers/postContoller');
const auth = require('../middleware/authMiddleware');
const ROLES_LIST = require('../config/roles_list.JS');
const verifyRoles = require('../middleware/verifyRoles');

postRouter.post('/myPosts',auth, postController.getMyPosts);
router.post('/publish', auth, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), postController.create);
module.exports = postRouter;