import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  const {
    body: { question },
    session: { user },
  } = req;
  const post = await client.post.create({
    data: {
      question,
      user: {
        connect: {
          id: user?.id,
        },
      },
    },
  });
  res.status(200).json({
    ok: true,
    post,
  });
};

export default withApiSession(withHandler({ methods: ["POST"], handler }));
