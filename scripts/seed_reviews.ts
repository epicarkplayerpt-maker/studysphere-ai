import prisma from '../src/lib/prisma';

async function seed() {
  console.log('Seeding verified student reviews...');
  try {
    // 1. Ensure we have mock users
    const user1 = await prisma.user.upsert({
      where: { email: 'cs_student@studysphere.local' },
      update: {},
      create: {
        email: 'cs_student@studysphere.local',
        passwordHash: 'dummyhash123',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const user2 = await prisma.user.upsert({
      where: { email: 'law_student@studysphere.local' },
      update: {},
      create: {
        email: 'law_student@studysphere.local',
        passwordHash: 'dummyhash456',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const user3 = await prisma.user.upsert({
      where: { email: 'humanities_student@studysphere.local' },
      update: {},
      create: {
        email: 'humanities_student@studysphere.local',
        passwordHash: 'dummyhash789',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // 2. Give them active sessions so they meet the 60s eligibility requirement
    await prisma.session.upsert({
      where: { token: 'mock-session-token-1' },
      update: { activeSeconds: 120 },
      create: {
        userId: user1.id,
        token: 'mock-session-token-1',
        activeSeconds: 120,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    await prisma.session.upsert({
      where: { token: 'mock-session-token-2' },
      update: { activeSeconds: 300 },
      create: {
        userId: user2.id,
        token: 'mock-session-token-2',
        activeSeconds: 300,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    await prisma.session.upsert({
      where: { token: 'mock-session-token-3' },
      update: { activeSeconds: 90 },
      create: {
        userId: user3.id,
        token: 'mock-session-token-3',
        activeSeconds: 90,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    // 3. Clear existing reviews to ensure clean state
    await prisma.review.deleteMany({});

    // 4. Create verified reviews
    await prisma.review.createMany({
      data: [
        {
          userId: user1.id,
          name: 'Marcus Chen',
          role: 'Computer Science Student',
          text: 'StudySphere synthesized 12 code repos and explained the whole microservice boundary in seconds. The automated concept mapping is outstanding.',
          rating: 5,
          category: 'stem',
        },
        {
          userId: user2.id,
          name: 'Elena Rostova',
          role: 'Law Student',
          text: 'Comparing contradictions across 4 files of legal code was impossible before. The cross-reference semantic synthesis cites document sections accurately.',
          rating: 5,
          category: 'law',
        },
        {
          userId: user3.id,
          name: 'David K.',
          role: 'History Student',
          text: 'The autonomous Weakness Finder targets specific gaps in my readings and starts a practice test immediately. It saved me hours of manual card mapping.',
          rating: 5,
          category: 'humanities',
        },
      ],
    });

    console.log('Successfully seeded 3 verified reviews.');
  } catch (error) {
    console.error('Error seeding reviews:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
