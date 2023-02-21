import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  const {
    query: { id },
  } = req;
  if (req.method === "DELETE") {
    await client.stream.delete({
      where: {
        id: Number(id),
      },
    });
  }
  if (req.method === "PUT") {
    await client.stream.update({
      where: {
        id: Number(id),
      },
      data: {
        completed: true,
      },
    });
  }
  res.status(200).json({
    ok: true,
  });
};

export default withApiSession(withHandler({ methods: ["DELETE", "PUT"], handler }));
