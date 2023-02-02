import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  const {
    query: { id },
    session: { user },
  } = req;
  const stream = await client.stream.findUnique({
    where: {
      id: Number(id),
    },
    // include는 모델 간 relationship을 select 할 때 사용한다.
    include: {
      messages: {
        select: {
          id: true,
          message: true,
          user: {
            select: {
              id: true,
              avatar: true,
            },
          },
        },
      },
    },
  });
  if (!stream) {
    return res.status(404).json({
      ok: false,
      error: "해당 제품은 존재하지 않습니다.",
    });
  }
  const isOwner = stream.userId === user?.id;
  if (stream && !isOwner) {
    stream.cloudflareUrl = "X";
    stream.cloudflareKey = "X";
  }
  res.status(200).json({
    ok: true,
    stream,
  });
};

export default withApiSession(withHandler({ methods: ["GET"], handler }));
