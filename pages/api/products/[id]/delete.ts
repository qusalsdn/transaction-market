import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  const {
    query: { id, imageId },
  } = req;
  if (req.method === "DELETE") {
    await client.product.delete({
      where: {
        id: Number(id),
      },
    });
    await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ID}/images/v1/${imageId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CF_IMAGE_TOKEN}`,
        },
      }
    );
    res.status(200).json({
      ok: true,
    });
  }
};

export default withApiSession(withHandler({ methods: ["DELETE"], handler }));
