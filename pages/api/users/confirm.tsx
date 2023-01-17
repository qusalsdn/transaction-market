import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withIronSessionApiRoute } from "iron-session/next";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  // 핸들러를 withIronSessionApiRoute 함수로 감싸줬기 때문에 req.session을 확인할 수 있다.
  console.log(req.session);
  const { token } = req.body;
  const exists = await client.token.findUnique({
    where: {
      payload: token,
    },
  });
  if (!exists) res.status(404).end();
  req.session.user = {
    id: exists?.userId,
  };
  await req.session.save();
  res.status(200).end();
};

export default withIronSessionApiRoute(withHandler("POST", handler), {
  cookieName: "carrotsession",
  password:
    "348905390534985doifgjoirjdiojfgiidfjklcvnblkncxvblknipjtgwpijtwirjtoijeoigjoighjfoighjoif",
});
