import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  // 핸들러를 withIronSessionApiRoute 함수로 감싸줬기 때문에 req.session을 확인할 수 있다.
  // console.log(req.session);
  const { token } = req.body;
  const foundToken = await client.token.findUnique({
    where: {
      payload: token,
    },
  });
  if (!foundToken) return res.status(404).end();
  req.session.user = {
    id: foundToken.userId,
  };
  await req.session.save();
  // 토큰이 계속해서 쌓이는 것을 방지
  await client.token.deleteMany({
    where: {
      userId: foundToken.userId,
    },
  });
  res.status(200).json({ ok: true });
};

export default withApiSession(
  withHandler({ methods: ["POST"], handler, isPrivate: false })
);
