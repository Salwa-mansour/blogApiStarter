const prisma = require('./prismaClient');

async function createComment(newComment) {
   
  return prisma.comment.create({
    data: newComment,
  });
}

module.exports = {
    createComment,
}