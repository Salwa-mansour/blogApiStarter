const express = require('express');
const commentRouter = express.Router({ mergeParams: true });
const commentController = require('../controllers/commentsController');
const auth = require('../middleware/authMiddleware');
const ROLES_LIST = require('../config/roles_list.js');
const verifyRoles = require('../middleware/verifyRoles');
const canModify = require('../middleware/canModify');
/// still i need to add verifyRoles middleware to the routes that require authentication, and specify the allowed roles for each route. For example, if only users with the "User" role should be able to create comments, you can modify the route like this:
commentRouter.get('/', commentController.getPostComments);
commentRouter.post('/add', auth, commentController.createComment);

commentRouter.get('/:id',commentController.commentData);
commentRouter.put('/:id', auth,canModify.authorizeComment, commentController.updatecomment);
commentRouter.delete('/:id', auth,canModify.authorizeComment({ allowAdmin: true }), commentController.deletecomment);
module.exports = commentRouter; 