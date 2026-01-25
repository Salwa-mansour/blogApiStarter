import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || 'Admin123!'; 
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  console.log('🚀 Seeding database...');

  const admin = await prisma.user.upsert({
    where: { userName: 'admin' },
    update: {}, 
    create: {
      userName: 'admin',
      password: hashedPassword,
      roles: ['ADMIN'], // Ensure 'ADMIN' is in your enum
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