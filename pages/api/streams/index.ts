import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  const {
    session: { user },
    body: { name, price, description },
  } = req;
  if (req.method === "POST") {
    const stream = await client.stream.create({
      data: {
        name,
        price,
        description,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    res.status(200).json({ ok: true, stream });
  }
  if (req.method === "GET") {
    // findMany 옵션에서 take는 db에서 5개만 가져오는거고 skip은 앞에 있는 5개를 스킵한다.
    const streams = await client.stream.findMany({ take: 10, skip: 10 });
    res.status(200).json({ ok: true, streams });
  }
};

export default withApiSession(withHandler({ methods: ["GET", "POST"], handler }));
