const Comment = require('../data/commentsData');

const authorizeComment = (options = { allowAdmin: false }) => {
    return async (req, res, next) => {
        try {
            const { commentId } = req.params;
            const userId = req.user.id;
            const userRole = req.user.role;

            const comment = await Comment.getCommentById(commentId);

            if (!comment) {
                return res.status(404).json({ message: "Comment not found." });
            }

            const isOwner = comment.author.toString() === userId;
            const isAdmin = userRole === 'admin';

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