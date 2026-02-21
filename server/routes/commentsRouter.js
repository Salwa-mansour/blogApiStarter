const express = require('express');
const commentRouter = express.Router();
const commentController = require('../controllers/commentsContoller');
const auth = require('../middleware/authMiddleware');
const ROLES_LIST = require('../config/roles_list.js');
const verifyRoles = require('../middleware/verifyRoles');

commentRouter.get('/', commentController.getPostComments);
commentRouter.post('/add', auth, commentController.createComment);

 commentRouter.get('/:id',commentController.commentData);
commentRouter.put('/:id', auth, commentController.updatecomment);
commentRouter.delete('/:id', auth, commentController.deletecomment);
module.exports = commentRouter; 