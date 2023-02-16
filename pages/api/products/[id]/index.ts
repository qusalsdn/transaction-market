import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  const {
    query: { id },
    session: { user },
  } = req;
  const product = await client.product.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      chatRoom: {
        select: {
          buyer: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
  const terms = product?.name.split(" ").map((word) => ({
    name: {
      contains: word,
    },
  }));
  const relatedProducts = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: product?.id,
        },
      },
    },
  });
  const isLiked = Boolean(
    await client.fav.findFirst({
      where: {
        productId: product?.id,
        userId: user?.id,
      },
      //  select를 이용하면 db의 모든 필드를 가져오지 않고 선택한 필드만 가져오게 된다.
      select: {
        id: true,
      },
    })
  );
  res.status(200).json({
    ok: true,
    product,
    relatedProducts,
    isLiked,
  });
};

export default withApiSession(withHandler({ methods: ["GET"], handler }));
