import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  const {
    query: { id },
  } = req;
  await client.post.delete({
    where: {
      id: Number(id),
    },
  });
  res.status(200).json({ ok: true });
};

export default withApiSession(withHandler({ methods: ["DELETE"], handler }));
