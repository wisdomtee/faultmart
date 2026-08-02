import { PrismaClient, CategoryType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const categories = [
        // Vehicles
        {
            name: "Cars",
            slug: "cars",
            type: CategoryType.VEHICLE,
        },
        {
            name: "SUVs",
            slug: "suvs",
            type: CategoryType.VEHICLE,
        },
        {
            name: "Trucks",
            slug: "trucks",
            type: CategoryType.VEHICLE,
        },
        {
            name: "Buses",
            slug: "buses",
            type: CategoryType.VEHICLE,
        },
        {
            name: "Motorcycles",
            slug: "motorcycles",
            type: CategoryType.VEHICLE,
        },

        // Appliances
        {
            name: "Phones",
            slug: "phones",
            type: CategoryType.APPLIANCE,
        },
        {
            name: "Laptops",
            slug: "laptops",
            type: CategoryType.APPLIANCE,
        },
        {
            name: "Televisions",
            slug: "televisions",
            type: CategoryType.APPLIANCE,
        },
        {
            name: "Refrigerators",
            slug: "refrigerators",
            type: CategoryType.APPLIANCE,
        },
        {
            name: "Air Conditioners",
            slug: "air-conditioners",
            type: CategoryType.APPLIANCE,
        },
        {
            name: "Generators",
            slug: "generators",
            type: CategoryType.APPLIANCE,
        },
        {
            name: "Washing Machines",
            slug: "washing-machines",
            type: CategoryType.APPLIANCE,
        },
    ];

    for (const category of categories) {
        await prisma.category.upsert({
            where: {
                slug: category.slug,
            },
            update: {},
            create: {
                ...category,
                description: `${category.name} listed for sale on FaultMart.`,
                isActive: true,
            },
        });
    }

    console.log("✅ Categories seeded successfully.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });