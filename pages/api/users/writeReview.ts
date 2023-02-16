import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  const {
    query: { productId, sellerId, buyerId },
    body: {
      review: { review },
      selectStar,
    },
  } = req;
  const findProductReview = await client.product.findUnique({
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
  if (findProductReview?._count.review === 0) {
    await client.review.create({
      data: {
        review,
        socre: selectStar,
        createdBy: {
          connect: {
            id: Number(buyerId),
          },
        },
        createdFor: {
          connect: {
            id: Number(sellerId),
          },
        },
        product: {
          connect: {
            id: Number(productId),
          },
        },
      },
    });
    res.status(200).json({ ok: true });
  } else {
    res.status(404).json({ ok: false });
  }
};

export default withApiSession(withHandler({ methods: ["POST"], handler }));
