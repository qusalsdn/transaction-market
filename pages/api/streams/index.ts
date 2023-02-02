import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  const {
    session: { user },
    body: { name, price, description },
    query: { page },
  } = req;
  if (req.method === "POST") {
    const removeCommaPrice = Number(price.replaceAll(",", ""));
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
        name,
        price: removeCommaPrice,
        description,
        user: {
          connect: {
            id: user?.id,
          },
        },
        cloudflareId: uid,
        cloudflareUrl: url,
        cloudflareKey: streamKey,
      },
    });
    res.status(200).json({ ok: true, stream });
  }
  if (req.method === "GET") {
    // findMany 옵션에서 take는 db에서 5개만 가져오는거고 skip은 앞에 있는 5개를 스킵한다.
    const streams = await client.stream.findMany({
      skip: (Number(page) - 1) * 10,
      take: 10,
      orderBy: {
        price: "asc",
      },
    });
    res.status(200).json({ ok: true, streams });
  }
};

export default withApiSession(withHandler({ methods: ["GET", "POST"], handler }));
