import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  const {
    query: { id },
    session: { user },
    body: { answer, answerId },
  } = req;
  if (req.method === "POST") {
    const newAnswer = await client.answer.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        post: {
          connect: {
            id: Number(id),
          },
        },
        answer,
      },
    });
    res.status(200).json({
      ok: true,
      answer: newAnswer,
    });
  }
  if (req.method === "PUT") {
    await client.answer.update({
      where: {
        id: Number(id),
      },
      data: {
        answer: req.body,
      },
    });
    res.status(200).json({ ok: true });
  }
  if (req.method === "DELETE") {
    await client.answer.delete({
      where: {
        id: answerId,
      },
    });
    res.status(200).json({ ok: true });
  }
};

export default withApiSession(
  withHandler({ methods: ["POST", "PUT", "DELETE"], handler })
);
