const Comment = require('../data/commentsData');

const authorizeComment = (options = { allowAdmin: false }) => {
    return async (req, res, next) => {
        try {
            const commentId  = parseInt(req.params.commentId); ;
            const userId = parseInt(req.user.userId);
            const comment = await Comment.getCommentById(commentId);
            if (!comment) {
                return res.status(404).json({ message: "Comment not found." });
            }
            const isOwner = comment.userId === userId;
            const isAdmin = req.user.roles && req.user.roles.includes('ADMIN');
            // console.log('IS OWNER:', isOwner, 'IS ADMIN:', isAdmin); // Debugging log
            // Logic: Always allow owner. Allow admin ONLY if the flag is true.
            if (isOwner || (options.allowAdmin && isAdmin)) {
                req.comment = comment;
                return next();
            }

            return res.status(403).json({ message: "Not authorized." });
        } catch (error) {
            res.status(500).json({ message: "Authorization error." });
        }
    };
};
module.exports = {
    authorizeComment
};