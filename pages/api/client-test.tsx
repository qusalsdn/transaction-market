import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../libs/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await prisma.user.create({
    data: {
      email: "hi1",
      name: "hi1",
    },
  });

  res.status(200).json({
    ok: true,
  });
};

export default handler;
