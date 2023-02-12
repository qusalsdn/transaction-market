import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  const {
    query: { productId, buyerId, sellerId },
    session: { user },
  } = req;
  if (req.method === "POST") {
    if (user?.id === Number(sellerId)) {
      return res
        .status(200)
        .json({ ok: false, error: "자기 자신과는 채팅을 할 수 없습니다." });
    }
    const checkRoom = await client.chatroom.findFirst({
      where: {
        productId: Number(productId),
        buyerId: Number(buyerId),
        sellerId: Number(sellerId),
      },
    });
    if (checkRoom) {
      res.status(200).json({ ok: false, chatRoomId: checkRoom.id });
    } else {
      const chatRoom = await client.chatroom.create({
        data: {
          product: {
            connect: {
              id: Number(productId),
            },
          },
          buyer: {
            connect: {
              id: Number(buyerId),
            },
          },
          seller: {
            connect: {
              id: Number(sellerId),
            },
          },
        },
      });
      res.status(200).json({ ok: true, chatRoomId: chatRoom.id });
    }
  }
  if (req.method === "GET") {
    const chatRooms = await client.chatroom.findMany({
      where: {
        OR: [{ buyerId: user?.id }, { sellerId: user?.id }],
      },
      include: {
        product: {
          select: {
            user: {
              select: {
                avatar: true,
                name: true,
              },
            },
          },
        },
        chatMessage: {
          select: {
            message: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    res.status(200).json({ ok: true, chatRooms });
  }
};

export default withApiSession(withHandler({ methods: ["GET", "POST"], handler }));
