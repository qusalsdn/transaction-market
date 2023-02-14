import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  const {
    query: { page, id },
  } = req;
  if (req.method === "GET") {
    const products = await client.product.findMany({
      skip: (Number(page) - 1) * 20,
      take: 20,
      orderBy: {
        createdAt: "desc",
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
  if (req.method === "PUT") {
    const {
      body: { name, price, description, photoId },
    } = req;
    const removeCommaPrice = Number(price.replaceAll(",", ""));
    const updateData = await client.product.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        price: removeCommaPrice,
        description,
        image: photoId,
      },
    });
    res.status(200).json({
      ok: true,
      updateData,
    });
    await res.revalidate(`/product/${id}`);
  }
};

export default withApiSession(withHandler({ methods: ["GET", "POST", "PUT"], handler }));
