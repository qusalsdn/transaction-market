import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  const {
    query: { id },
  } = req;
  const chatRoom = await client.chatroom.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      buyer: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      seller: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      chatMessage: {
        select: {
          id: true,
          message: true,
          user: {
            select: {
              id: true,
              avatar: true,
            },
          },
        },
      },
      product: {
        select: {
          completed: true,
          doneDealId: true,
        },
      },
    },
  });
  res.status(200).json({ ok: true, chatRoom });
};

export default withApiSession(withHandler({ methods: ["GET"], handler }));
