import { PrismaClient, Role } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create default super admin
  const hashedPassword = await bcryptjs.hash('Admin@123', 10);
  
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@flashsolar.com' },
    update: {},
    create: {
      email: 'admin@flashsolar.com',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: Role.SUPER_ADMIN,
    },
  });

  console.log('Seed data created:', { superAdmin });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
