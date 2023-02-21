import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  const {
    query: { id },
    body: {
      data: { name, price, description },
    },
  } = req;
  const removeCommaPrice = Number(price.replaceAll(",", ""));
  await client.stream.update({
    where: {
      id: Number(id),
    },
    data: {
      name,
      price: removeCommaPrice,
      description,
    },
  });
  res.status(200).json({
    ok: true,
  });
};

export default withApiSession(withHandler({ methods: ["PUT"], handler }));
