import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  const {
    session: { user },
    query: { otherProfileId },
  } = req;
  if (otherProfileId) {
    const sales = await client.sale.findMany({
      where: {
        userId: Number(otherProfileId),
      },
      include: {
        product: {
          include: {
            _count: {
              select: {
                favs: true,
                chatRoom: true,
              },
            },
          },
        },
      },
    });
    res.status(200).json({
      ok: true,
      sales,
    });
  } else {
    const sales = await client.sale.findMany({
      where: {
        userId: user?.id,
      },
      include: {
        product: {
          include: {
            _count: {
              select: {
                favs: true,
                chatRoom: true,
              },
            },
          },
        },
      },
    });
    res.status(200).json({
      ok: true,
      sales,
    });
  }
};

export default withApiSession(withHandler({ methods: ["GET"], handler }));
