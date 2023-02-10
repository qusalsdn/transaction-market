import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  const {
    body: { question, latitude, longitude },
    session: { user },
  } = req;
  if (req.method === "POST") {
    const post = await client.post.create({
      data: {
        question,
        latitude,
        longitude,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    // On-Demand Revalidation(ODR)을 이용하면 수동으로 getStaticProps를 어디에서든지 작동시킬 수 있다.
    await res.revalidate("/community");
    res.status(200).json({
      ok: true,
      post,
    });
  }
  if (req.method === "GET") {
    const {
      query: { latitude, longitude, page },
    } = req;
    const parsedLatiude = parseFloat(`${latitude}`);
    const parsedLongitude = parseFloat(`${longitude}`);
    const posts = await client.post.findMany({
      skip: (Number(page) - 1) * 20,
      take: 20,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            wondering: true,
            answers: true,
          },
        },
      },
      where: {
        // gte: 크거나 같다.
        // lte: 작거나 같다.
        latitude: {
          gte: parsedLatiude - 0.01,
          lte: parsedLatiude + 0.01,
        },
        longitude: {
          gte: parsedLongitude - 0.01,
          lte: parsedLongitude + 0.01,
        },
      },
    });
    res.status(200).json({
      ok: true,
      posts,
    });
  }
};

export default withApiSession(withHandler({ methods: ["GET", "POST"], handler }));
