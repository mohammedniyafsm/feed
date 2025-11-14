import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // --------------------------
  // 1️⃣ Create 10 Demo Users
  // --------------------------
  const users = [];
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        githubId: `demo-github-${i}`,
        username: faker.person.fullName(),
        email: faker.internet.email(),
        image: faker.image.avatar(),
        role: "USER",
      },
    });
    users.push(user);
  }
  console.log("✔ Users created:", users.length);

  const categories: ("QUOTE" | "SELF_INTRO" | "PRESENTATION")[] = [
    "QUOTE",
    "SELF_INTRO",
    "PRESENTATION",
  ];

  const allSections: any[] = [];

  // --------------------------
  // 2️⃣ Seed past 30 days
  // --------------------------
  for (let day = 30; day >= 1; day--) {
    const date = new Date();
    date.setDate(date.getDate() - day);

    // 2–3 QUOTE per day
    const quoteCount = faker.number.int({ min: 2, max: 3 });
    for (let i = 0; i < quoteCount; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const section = await prisma.section.create({
        data: {
          userId: user.id,
          category: "QUOTE",
          topic: faker.lorem.sentence(),
          date,
        },
      });
      allSections.push(section);

      // Add feedback comments
      const feedbackCount = faker.number.int({ min: 1, max: 5 });
      for (let j = 0; j < feedbackCount; j++) {
        const feedbackUser = users[Math.floor(Math.random() * users.length)];
        await prisma.feedback.create({
          data: {
            userId: feedbackUser.id,
            sectionId: section.id,
            comment: faker.lorem.sentence(),
            anonymous: faker.datatype.boolean(),
          },
        });
      }

      // Add section likes
      const likeCount = faker.number.int({ min: 1, max: 5 });
      for (let j = 0; j < likeCount; j++) {
        const likeUser = users[Math.floor(Math.random() * users.length)];
        try {
          await prisma.sectionLike.create({
            data: { userId: likeUser.id, sectionId: section.id },
          });
        } catch {}
      }
    }

    // 1 SELF_INTRO
    const selfIntroUser = users[Math.floor(Math.random() * users.length)];
    const selfIntro = await prisma.section.create({
      data: {
        userId: selfIntroUser.id,
        category: "SELF_INTRO",
        topic: faker.lorem.sentence(),
        date,
      },
    });
    allSections.push(selfIntro);

    // 1 PRESENTATION
    const presentationUser = users[Math.floor(Math.random() * users.length)];
    const presentation = await prisma.section.create({
      data: {
        userId: presentationUser.id,
        category: "PRESENTATION",
        topic: faker.lorem.sentence(),
        date,
      },
    });
    allSections.push(presentation);
  }

  // --------------------------
  // 3️⃣ Seed next 30 days (future)
  // --------------------------
  for (let day = 1; day <= 30; day++) {
    const date = new Date();
    date.setDate(date.getDate() + day);

    // 2–3 QUOTE per day
    const quoteCount = faker.number.int({ min: 2, max: 3 });
    for (let i = 0; i < quoteCount; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const section = await prisma.section.create({
        data: {
          userId: user.id,
          category: "QUOTE",
          topic: faker.lorem.sentence(),
          date,
        },
      });
      allSections.push(section);
    }

    // 1 SELF_INTRO
    const selfIntroUser = users[Math.floor(Math.random() * users.length)];
    const selfIntro = await prisma.section.create({
      data: {
        userId: selfIntroUser.id,
        category: "SELF_INTRO",
        topic: faker.lorem.sentence(),
        date,
      },
    });
    allSections.push(selfIntro);

    // 1 PRESENTATION
    const presentationUser = users[Math.floor(Math.random() * users.length)];
    const presentation = await prisma.section.create({
      data: {
        userId: presentationUser.id,
        category: "PRESENTATION",
        topic: faker.lorem.sentence(),
        date,
      },
    });
    allSections.push(presentation);
  }

  console.log("✔ Past and future sections created, with feedback and likes for past only");

  console.log("🎉 SEEDING COMPLETE 🎉");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
