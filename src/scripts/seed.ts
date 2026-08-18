import { eq } from "drizzle-orm";
import { db } from "../db/index.ts";
import { categories, consultants, schedules, services, users } from "../db/schema/index.ts";
import { hashPassword } from "../utils/password.ts";
import { slugify } from "../utils/slug.ts";

const categoryNames = ["Psikologi", "Bisnis", "Pendidikan", "Karier", "Hukum"];

async function seed() {
  const [admin] = await db.select().from(users).where(eq(users.email, "admin@konsulify.test")).limit(1);
  if (!admin) {
    await db.insert(users).values({
      name: "Administrator",
      email: "admin@konsulify.test",
      phone: "0800000000",
      password: await hashPassword("admin12345"),
      role: "admin",
    });
  }

  for (const name of categoryNames) {
    const [existing] = await db.select().from(categories).where(eq(categories.slug, slugify(name))).limit(1);
    if (!existing) {
      await db.insert(categories).values({
        name,
        slug: slugify(name),
        description: `Layanan konsultasi ${name.toLowerCase()} bersama konsultan berpengalaman.`,
      });
    }
  }

  const allCategories = await db.select().from(categories);
  const consultantSamples = [
    ["Dr. Andi Wijaya", "M.Psi", "Psikologi", "Psikologi Klinis", 7],
    ["Sari Permata", "MBA", "Bisnis", "Strategi UMKM", 9],
    ["Budi Santoso", "M.Pd", "Pendidikan", "Perencanaan Belajar", 6],
    ["Nadia Kirana", "CHRP", "Karier", "Pengembangan Karier", 8],
    ["Rama Putra", "S.H.", "Hukum", "Legal Keluarga", 10],
    ["Maya Laras", "M.Psi", "Psikologi", "Konseling Remaja", 5],
    ["Iqbal Hakim", "MBA", "Bisnis", "Keuangan Bisnis", 11],
    ["Dewi Ayu", "M.Pd", "Pendidikan", "Kurikulum", 7],
  ] as const;

  for (const [name, title, categoryName, specialization, experienceYears] of consultantSamples) {
    const [existing] = await db.select().from(consultants).where(eq(consultants.name, name)).limit(1);
    const category = allCategories.find((item) => item.name === categoryName);
    if (!existing && category) {
      await db.insert(consultants).values({
        categoryId: category.id,
        name,
        title,
        email: `${slugify(name)}@konsulify.test`,
        phone: "081234567890",
        specialization,
        experienceYears,
        description: `${name} membantu klien melalui sesi konsultasi profesional dan terarah.`,
      });
    }
  }

  const allConsultants = await db.select().from(consultants);
  for (const consultant of allConsultants.slice(0, 10)) {
    const [existingService] = await db.select().from(services).where(eq(services.consultantId, consultant.id)).limit(1);
    if (!existingService) {
      await db.insert(services).values({
        consultantId: consultant.id,
        name: `Konsultasi ${consultant.specialization}`,
        description: "Sesi konsultasi online personal selama 60 menit.",
        durationMinutes: 60,
        price: "150000.00",
      });
    }

    const [existingSchedule] = await db.select().from(schedules).where(eq(schedules.consultantId, consultant.id)).limit(1);
    if (!existingSchedule) {
      await db.insert(schedules).values({
        consultantId: consultant.id,
        date: new Date("2026-08-20"),
        startTime: "09:00:00",
        endTime: "10:00:00",
        status: "available",
      });
      await db.insert(schedules).values({
        consultantId: consultant.id,
        date: new Date("2026-08-21"),
        startTime: "13:00:00",
        endTime: "14:00:00",
        status: "available",
      });
    }
  }

  console.log("Seeder Konsulify selesai.");
}

await seed();
process.exit(0);
