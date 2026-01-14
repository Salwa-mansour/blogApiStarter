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
// Inside your /refresh route logic
async function rotateToken(oldJti, userId, newHashedToken){
  return await prisma.$transaction([
    // 1. Delete the old token immediately
    prisma.refreshToken.delete({
      where: { id: oldJti }
    }),
    // 2. Create the new one
    prisma.refreshToken.create({
      data: {
        userId: userId,
        hashedToken: newHashedToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    })
  ]);
};


module.exports = {
  createUser,
  findByEmail,
  comparePassword,
  findUserById,
  rotateToken
}