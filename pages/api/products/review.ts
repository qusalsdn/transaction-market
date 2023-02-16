import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  const {
    query: { productId },
  } = req;
  const productReview = await client.product.findUnique({
    where: {
      id: Number(productId),
    },
    select: {
      _count: {
        select: {
          review: true,
        },
      },
    },
  });
  res.status(200).json({
    ok: true,
    productReview,
  });
};

export default withApiSession(withHandler({ methods: ["GET"], handler }));
