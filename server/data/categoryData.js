const prisma = require('./prismaClient');

async function createCategory({ categoryName,categoryDesc }) {

 return prisma.category.create({
   
   data: { name:categoryName, description:categoryDesc},
 });
}

async function getAllCategories() {
  const categories = await prisma.category.findMany();
 
  if (!categories || categories.length === 0) {
    return null; // No categories found
  }
    return categories;
}

module.exports = {
    createCategory,
    getAllCategories
}