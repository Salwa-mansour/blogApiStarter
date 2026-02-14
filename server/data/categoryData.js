const prisma = require('./prismaClient');

async function createCategory({ categoryName,categoryDesc }) {

  return prisma.category.create({
    data: { name:categoryName, description:categoryDesc},
  });
}

async function getAllCategories() {
    return prisma.category.findMany();
}

module.exports = {
    createCategory,
    getAllCategories
}