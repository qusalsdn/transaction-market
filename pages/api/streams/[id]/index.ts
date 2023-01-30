import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  const {
    query: { id },
  } = req;
  const streams = await client.stream.findUnique({
    where: {
      id: Number(id),
    },
  });
  if (!streams) {
    return res.status(404).json({
      ok: false,
      error: "해당 제품은 존재하지 않습니다.",
    });
  }
  res.status(200).json({
    ok: true,
    streams,
  });
};

export default withApiSession(withHandler({ methods: ["GET"], handler }));
