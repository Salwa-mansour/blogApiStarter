const prisma = require('./prismaClient');
const bcrypt = require('bcryptjs');

// account related queries
async function createUser({ userName, email, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: { userName, email, password: hashedPassword },
  });
}

async function findByEmail(email) {
  console.log(email);
  return prisma.user.findUnique({
    where: {
      email: email, 
    },
  });
}

async function comparePassword(plain, hashed) {
  return bcrypt.compare(plain, hashed);
}

async function findUserById(id) {
  return prisma.user.findUnique({ where: { id: Number(id) } });
}



module.exports = {
  createUser,
  findByEmail,
  comparePassword,
  findUserById,
}