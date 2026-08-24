import { PrismaClient, Role, UserStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@faultmart.com";

  const user = await prisma.user.update({
    where: { email },
    data: {
      password:
        "$2b$12$EtOav/46esX8HTjjuUkO3u4H.OiLeUvvg5gxIthz/DIFoOYcr1RbS",
      role: Role.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  console.log("ADMIN RESET SUCCESS:", {
    id: user.id,
    email: user.email,
    role: user.role,
    status: user.status,
  });
}

main()
  .catch((error) => {
    console.error("ADMIN RESET FAILED:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
