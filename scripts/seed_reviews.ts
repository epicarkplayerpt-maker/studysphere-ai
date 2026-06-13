import prisma from '../src/lib/prisma';

async function seed() {
  console.log('Cleaning up verified student reviews to enforce transparency...');
  try {
    // 1. Delete all reviews
    await prisma.review.deleteMany({});
    
    // 2. Delete mock local users
    await prisma.user.deleteMany({
      where: {
        email: {
          endsWith: '@studysphere.local'
        }
      }
    });
    
    console.log('Successfully cleared all mock reviews and local test users from the database.');
  } catch (error) {
    console.error('Error cleaning reviews:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
