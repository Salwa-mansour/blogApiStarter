const prisma = require('./prismaClient');
const bcrypt = require('bcryptjs');

// account related queries
async function createUser({ userName, email, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: { userName, email, password: hashedPassword },
  });
}
async function allUsers() {
  return prisma.user.findMany();
}
async function findByEmail(email) {

  return prisma.user.findUnique({
    where: {
      email: email, 
    },
  });
}
async function findByUserName(userName) {
  return prisma.user.findUnique({
    where: {
      userName: userName, 
    },});
}
async function comparePassword(plain, hashed) {
  return bcrypt.compare(plain, hashed);
}

async function findUserById(id) {
  return prisma.user.findUnique({ where: { id: Number(id) } });
}
async function rotateToken(oldJti, userId) {
    try {
        // We use a transaction so if one fails, the whole thing cancels
        const [deleted, created] = await prisma.$transaction([
            // Delete the old used token
            prisma.refreshToken.delete({
                where: { id: oldJti }
            }),
            // Create the next valid token
            prisma.refreshToken.create({
                data: {
                    userId: userId,
                    expiresAt: new Date(Date.now() +  24 * 60 * 60 * 1000)
                }
            })
        ]);
        
        return created; // This contains the new 'id'
    } catch (error) {
        // If deletion fails, it means the jti was already used (Security risk!)
        console.error("Token rotation failed - possible replay attack");
        return null;
    }
}
async function  findToken(jti) {
  return await prisma.refreshToken.findUnique({ where: { id: jti } });
}
async function deleteToken(jti){
  return  await prisma.refreshToken.deleteMany({ where: { id: jti } });
}
async function updatedUser(userId,newRoles){ prisma.user.update({
            where: { id: Number(userId) },
            data: { roles: newRoles },
            select: { id: true, username: true, roles: true }
        });
  
}
module.exports = {
  createUser,
  allUsers,
  findByEmail,
  findByUserName,
  updatedUser,
  comparePassword,
  findUserById,
  rotateToken,
  deleteToken,
  findToken
}