import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  const {
    query: { page },
  } = req;
  if (req.method === "GET") {
    const products = await client.product.findMany({
      skip: (Number(page) - 1) * 10,
      take: 10,
      orderBy: {
        createdAt: "asc",
      },
      include: {
        _count: {
          select: {
            favs: true,
          },
        },
      },
    });
    res.status(200).json({
      ok: true,
      products,
    });
  }
  if (req.method === "POST") {
    const {
      body: { name, price, description, photoId },
      session: { user },
    } = req;
    const removeCommaPrice = Number(price.replaceAll(",", ""));
    const product = await client.product.create({
      data: {
        name,
        price: removeCommaPrice,
        description,
        image: photoId,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    res.status(200).json({
      ok: true,
      product,
    });
  }
};

export default withApiSession(withHandler({ methods: ["GET", "POST"], handler }));
