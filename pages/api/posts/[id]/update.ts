import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  const {
    query: { id },
    body: { title, question },
  } = req;
  await client.post.update({
    where: {
      id: Number(id),
    },
    data: {
      title,
      question,
    },
  });
  res.status(200).json({ ok: true });
};

export default withApiSession(withHandler({ methods: ["PUT"], handler }));
