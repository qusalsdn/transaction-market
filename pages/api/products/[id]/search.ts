import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  const {
    query: { id },
  } = req;
  const product = await client.product.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      image: true,
      name: true,
      price: true,
      description: true,
    },
  });
  res.status(200).json({
    ok: true,
    product,
  });
};

export default withApiSession(withHandler({ methods: ["GET"], handler }));
