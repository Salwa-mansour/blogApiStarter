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
async function postUpdate(id, newData) {
 
  try {
    return await prisma.post.update({
      where: { id: Number(id) },
      data: newData
    });
  } catch (error) {
    console.error("Prisma Error Code:", error.code); // Look for P2025
    console.error("Prisma Error Message:", error.message);
    throw error; // Let the controller handle the response
  }
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