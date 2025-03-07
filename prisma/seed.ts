import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ユーザーを作成
  const user1 = await prisma.user.create({
    data: {
      name: "田中 太郎",
      email: "tanaka@example.com",
      password: "hashedpassword123", // 実際にはハッシュ化する
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "佐藤 花子",
      email: "sato@example.com",
      password: "hashedpassword456",
    },
  });

  // 患者を作成
  const patient1 = await prisma.patient.create({
    data: {
      name: "鈴木 一郎",
      password: "hashedpassword789",
    },
  });

  const patient2 = await prisma.patient.create({
    data: {
      name: "山田 次郎",
      password: "hashedpassword321",
    },
  });

  // ユーザーと患者の関連付け
  await prisma.userPatient.createMany({
    data: [
      {
        userId: user1.id,
        patientId: patient1.id,
      },
      {
        userId: user2.id,
        patientId: patient2.id,
      },
    ],
  });

  // 血圧データを作成
  await prisma.bloodPressureData.createMany({
    data: [
      {
        patientId: patient1.id,
        systolic: 120,
        diastolic: 80,
        pulse: 70,
        measuredAt: new Date("2025-03-01T08:00:00Z"),
        memo: "朝測定",
      },
      {
        patientId: patient1.id,
        systolic: 130,
        diastolic: 85,
        pulse: 72,
        measuredAt: new Date("2025-03-01T20:00:00Z"),
        memo: "夜測定",
      },
      {
        patientId: patient2.id,
        systolic: 140,
        diastolic: 90,
        pulse: 75,
        measuredAt: new Date("2025-03-01T08:30:00Z"),
        memo: "朝測定",
      },
    ],
  });

  console.log("✅ Seeding completed!");
}

// エラーハンドリング
main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
