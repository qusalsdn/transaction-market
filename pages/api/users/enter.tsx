import withHandler from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../libs/server/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.body);
  res.status(200).end();
};

export default withHandler("POST", handler);
