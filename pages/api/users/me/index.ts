import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  const profile = await client.user.findUnique({
    where: {
      id: req.session.user?.id,
    },
  });
  if (!profile) {
    return res.status(404).json({
      ok: false,
      error: "로그인을 해주세요.",
    });
  }
  res.status(200).json({
    ok: true,
    profile,
  });
};

export default withApiSession(withHandler({ methods: ["GET"], handler }));
