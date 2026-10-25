import { prisma } from "../src/lib/prisma.js";
import bcrypt from "bcryptjs";

export async function main() {
    const hashedPassword = await bcrypt.hash("password", 10);

    await prisma.user.upsert({
        where: {
            email: "admin@OhoShop.local",
        },
        update: {},
        create: {
            name: "Admin",
            email: "admin@OhoShop.local",
            password: hashedPassword,
            role: "Admin"
        }
    });

    const categories = ["Clothing", "Electronics", "Food"];

    for (const name of categories) {
        await prisma.category.upsert({
            where: { name },
            update: {},
            create: { name }
        });
    }

    console.log(`Database Seeded successfully!`);
}

main()
    .catch((error) => {
        console.log(`Seeding Error:`, error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect()
    });