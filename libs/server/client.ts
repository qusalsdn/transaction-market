import { PrismaClient } from "@prisma/client";

// npx prisma generate 명령어를 터미널에 입력하면 프리스마가 스키마를 확인해서 타입스크립트로 타입을 만들어준다.
// 위의 명령어로 인해 자동완성 기능을 사용할 수 있다.

declare global {
  var client: PrismaClient | undefined;
}

// 이 파일을 처음 시작하면 global.client에는 아무것도 들어있지 않는다. 그래서 새로운 PrismaClient를 만든다.
const client = global.client || new PrismaClient();

if (process.env.NODE_ENV === "development") global.client = client;

export default client;
