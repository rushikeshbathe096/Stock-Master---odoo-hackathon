const { PrismaClient } = require('@prisma/client');
try {
  const p = new PrismaClient();
  console.log('PrismaClient created successfully');
  p.$disconnect().then(()=>process.exit(0));
} catch (e) {
  console.error('Error instantiating PrismaClient:');
  console.error(e);
  process.exit(1);
}
