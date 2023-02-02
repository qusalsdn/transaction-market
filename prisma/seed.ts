import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

async function main() {
  [...Array.from(Array(57).keys())].forEach(async (item) => {
    const {
      result: {
        uid,
        rtmps: { url, streamKey },
      },
    } = await (
      await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ID}/stream/live_inputs`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${process.env.CF_STREAM_TOKEN}` },
          body: `{"meta": {"name":"${name}"},"recording": { "mode": "automatic", "timeoutSeconds": 10 }}`,
        }
      )
    ).json();
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
        cloudflareId: uid,
        cloudflareUrl: url,
        cloudflareKey: streamKey,
      },
    });
    console.log(`${item}/57`);
  });
}

// 데이터베이스를 시드하려면 db seed CLI 명령을 실행하십시오. npx prisma db seed
main()
  .catch((e) => console.log(e))
  .finally(() => client.$disconnect());
