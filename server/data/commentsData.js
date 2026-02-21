const prisma = require('./prismaClient');

async function createComment(newComment) {
   
  return prisma.comment.create({
    data: newComment,
  });
}
async function getPostComments(postId) {
    return prisma.comment.findMany({
        where: { postId },  
        orderBy: { createdAt: 'desc' }, // Optional: to get the latest comments first
    });
}
async function getCommentById(commentId) {
    return prisma.comment.findUnique({
        where: { id: commentId },
    });
} 
async function updateComment(commentId, updatedData) {
    return prisma.comment.update({
        where: { id: commentId },
        data: updatedData,
    });
}
async function deleteComment(commentId) {
    return prisma.comment.delete({
        where: { id: commentId },
    });
}
module.exports = {
    createComment,
    getPostComments,
    getCommentById,
    updateComment,
    deleteComment
}