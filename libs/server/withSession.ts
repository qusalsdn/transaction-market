import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

const cookieOptions = {
  cookieName: "carrotsession",
  password: process.env.COOKIE_PASSWORD!,
};

export const withApiSession = (fn: any) => {
  return withIronSessionApiRoute(fn, cookieOptions);
};

// 위의 헬퍼 함수와 똑같은 기능이지만 getServerSideProps 안에서 인증 기능을 사용할 수 있게 해준다.
export const withSsrSession = (handler: any) => {
  return withIronSessionSsr(handler, cookieOptions);
};
