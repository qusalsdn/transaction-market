import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

async function main() {
  [...Array.from(Array(57).keys())].forEach(async (item) => {
    const stream = await client.stream.create({
      data: {
        name: String(item),
        price: item,
        description: String(item),
        user: {
          connect: {
            id: 1,
          },
        },
      },
    });
    console.log(`${item}/57`);
  });
}

// 데이터베이스를 시드하려면 db seed CLI 명령을 실행하십시오. npx prisma db seed
main()
  .catch((e) => console.log(e))
  .finally(() => client.$disconnect());
