import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import twilio from "twilio";
import smtpTransport from "@libs/server/email";
import mail from "@sendgrid/mail";

mail.setApiKey(process.env.SENDGRID_APIKEY!);

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  const { email, phone } = req.body;
  const user = email ? { email } : phone ? { phone: phone } : null;
  if (!user) return res.status(400).json({ ok: false });
  const payload = Math.floor(100000 + Math.random() * 900000) + ""; // + ""을 붙이면 문자열로 변환된다.

  const token = await client.token.create({
    data: {
      payload,
      user: {
        // where의 조건을 만족하는 user가 있는 경우에는 token과 연결하고 없으면 create의 프로퍼티를 가지고 user를 만들고 token과 연결한다.
        // 이로 인해 db에서 유저를 찾을 필요 없이 모든 걸 한 번에 처리할 수 있다.
        connectOrCreate: {
          where: {
            ...user,
          },
          create: {
            name: "Anonymous",
            ...user,
          },
        },
      },
    },
  });

  if (phone) {
    const message = await twilioClient.messages.create({
      messagingServiceSid: process.env.TWILIO_MSID,
      to: `82${phone}`,
      // to: process.env.MY_NUMBER!, // MY_NUMBER라는 환경변수가 존재하지 않을 수도 있기 때문에 !를 붙여준다.
      body: `인증번호 : ${payload}`,
    });
  } else if (email) {
    // const msg = {
    //   to: email,
    //   from: "yja05092@naver.com",
    //   subject: "당근마켓 인증 메일",
    //   text: `인증번호 : ${payload}`,
    //   html: `<strong>인증번호 : ${payload}</strong>`,
    // };
    // mail
    //   .send(msg)
    //   .then(() => console.log("done!"))
    //   .catch((error) => console.log(error));
    // const sendEmail = await mail.send({
    //   from: "yja05092@naver.com",
    //   to: email,
    //   subject: "당근마켓 인증 메일",
    //   text: `인증번호 : ${payload}`,
    // });
    // console.log(sendEmail);
    const mailOptions = {
      from: process.env.MAIL_ID,
      to: email,
      subject: "캐럿마켓 인증 메일",
      text: `인증번호 : ${payload}`,
    };
    const result = await smtpTransport.sendMail(mailOptions, (error, responses) => {
      if (error) {
        console.log(error);
        return null;
      } else {
        console.log(responses);
        return null;
      }
    });
  }

  // upsert는 뭔가를 만들 때 사용하지는 않는다. 단지, 생성하거나 수정할 때 사용한다.
  // const user = await client.user.upsert({
  //   where: {
  //     ...payload,
  //   },
  //   create: {
  //     name: "Anonymous",
  //     ...payload,
  //   },
  //   update: {},
  // });

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
  res.status(200).json({ ok: true });
};

export default withHandler({ methods: ["POST"], handler, isPrivate: false });
