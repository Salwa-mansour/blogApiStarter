const prisma = require('./prismaClient');
async function createPost(newPost) {
   
  return prisma.post.create({
    data: newPost,
  });
}
async function getAllposts() {
    return prisma.post.findMany();
}
module.exports = {
    createPost,
    getAllposts
}