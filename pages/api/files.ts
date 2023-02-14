import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  const {
    query: { update, imageId },
  } = req;
  // Cloudflare에 이미지를 업로드 하는 과정
  // 1.유저가 백엔드에 Cloudflare URL을 요구한다.
  // 2.백엔드에서 Cloudflare에게 URL을 요청한다.
  // 3.Cloudflare가 백엔드로 URL을 보내준다.
  // 4.백엔드에서 유저에게 URL을 보내준다.
  // 5.유저는 그 URL로 직접 파일을 업로드한다.
  if (update === "update") {
    await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ID}/images/v1/${imageId}`,
      {
        headers: { Authorization: `Bearer ${process.env.CF_IMAGE_TOKEN}` },
      }
    );
  }
  const response = await (
    await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ID}/images/v2/direct_upload`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.CF_IMAGE_TOKEN}` },
      }
    )
  ).json();
  res.status(200).json({
    ok: true,
    ...response.result,
  });
};

export default withApiSession(withHandler({ methods: ["GET"], handler }));
