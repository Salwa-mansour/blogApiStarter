const prisma = require('./prismaClient');

async function createPost(newPost) {
   
  return prisma.post.create({
    data: newPost,
  });
}
async function getAllposts() {
    return prisma.post.findMany();
}
async function getUserPosts(id) {
  return prisma.post.findMany({
    where:{
      userId:id
    }
  });
}
async function getPostById(id) {
  return prisma.post.findFirst({
      where:{
        id:id
      }
  });
  
}
async function postUpdate(id,newData) {
  return prisma.post.update({
    where:{
      id:id
    },
    data:newData
  });
}
async function postDelete(id) {
  return prisma.post.delete({
    where:{
      id:id
    }
  });
}
module.exports = {
    createPost,
    getAllposts,
    getUserPosts,
    getPostById,
    postUpdate,
    postDelete
}