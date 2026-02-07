require('dotenv').config();
const prisma = require('../data/prismaClient');
const bcrypt = require('bcryptjs');

async function main() {
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || 'Admin123!'; 
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  console.log('🚀 Seeding database...');

  const admin = await prisma.user.upsert({
    where: { userName: 'admin' },
    update: {}, 
    create: {
      userName: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
       roles: ['ADMIN'], // Uncomment if your schema has a roles field
    },
  });

  console.log('✅ Admin user created:', admin.userName);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });