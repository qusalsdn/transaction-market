import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../libs/server/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "post") {
    res.status(401).end();
  }
  console.log(req.body.email);
  res.status(200).end();
};

export default handler;
