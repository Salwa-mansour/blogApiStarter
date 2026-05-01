const prisma = require('./prismaClient');

async function createCategory({ categoryName,categoryDesc }) {

 return prisma.category.create({
   
   data: { name:categoryName, description:categoryDesc},
 });
}
async function getCategoryById(categoryId) {
    const category = await prisma.category.findUnique({
        where: { id: categoryId }
    });
    return category;
}
async function getAllCategories() {
  const categories = await prisma.category.findMany();
 
  if (!categories || categories.length === 0) {
    return null; // No categories found
  }
    return categories;
}
async function updateCategory(categoryId, newData) {
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
        return null; // Category not found
    }
    const updatedCategory = await prisma.category.update({
        where: { id: categoryId },
        data: newData
    });
    return updatedCategory;
}
module.exports = {
    createCategory,
    getAllCategories,
    updateCategory,
    getCategoryById
}