import withHandler from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, phone } = req.body;
  const payload = email ? { email } : { phone: +phone };
  // upsert는 뭔가를 만들 때 사용하지는 않는다. 단지, 생성하거나 수정할 때 사용한다.
  const user = await client.user.upsert({
    where: {
      ...payload,
    },
    create: {
      name: "Anonymous",
      ...payload,
    },
    update: {},
  });
  console.log(user);

  // if (email) {
  //   user = await client.user.findUnique({
  //     where: {
  //       email,
  //     },
  //   });
  //   if (user) console.log("찾았다.!");
  //   if (!user) {
  //     console.log("유저를 찾지 못했기 때문에 유저를 생성합니다.");
  //     user = await client.user.create({
  //       data: {
  //         name: "Anonymous",
  //         email,
  //       },
  //     });
  //   }
  //   console.log(user);
  // }
  // if (phone) {
  //   user = await client.user.findUnique({
  //     where: {
  //       // 문자열인 변수 앞에 '+'만 붙이면 숫자형으로 손쉽게 변경할 수 있다.
  //       phone: +phone,
  //     },
  //   });
  //   if (user) console.log("찾았다.!");
  //   if (!user) {
  //     console.log("유저를 찾지 못했기 때문에 유저를 생성합니다.");
  //     user = await client.user.create({
  //       data: {
  //         name: "Anonymous",
  //         phone: +phone,
  //       },
  //     });
  //   }
  //   console.log(user);
  // }
  res.status(200).end();
};

export default withHandler("POST", handler);
