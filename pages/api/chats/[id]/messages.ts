import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  const {
    query: { id },
    body,
    session: { user },
  } = req;
  // const message = await client.message.create({
  //   data: {
  //     message: body.message,
  //     product: {
  //       connect: {
  //         id: Number(id),
  //       },
  //     },
  //     user: {
  //       connect: {
  //         id: user?.id,
  //       },
  //     },

  //   },
  // });
  res.status(200).json({
    ok: true,
    // message,
  });
};

export default withApiSession(withHandler({ methods: ["POST"], handler }));
