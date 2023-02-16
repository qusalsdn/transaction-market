import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  const {
    query: { id, completed },
    body: { doneDealId },
  } = req;
  if (req.method === "PUT") {
    if (completed) {
      await client.product.update({
        where: {
          id: Number(id),
        },
        data: {
          completed: true,
          doneDealId: Number(doneDealId),
        },
      });
      res.status(200).json({
        ok: true,
      });
    } else {
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
    }
    await res.revalidate(`/products/${id}`);
  }
};

export default withApiSession(withHandler({ methods: ["PUT"], handler }));
