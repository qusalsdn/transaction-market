import { PrismaClient } from "@prisma/client";

// npx prisma generate 명령어를 터미널에 입력하면 프리스마가 스키마를 확인해서 타입스크립트로 타입을 만들어준다.
// 위의 명령어로 인해 자동완성 기능을 사용할 수 있다.
const prisma = new PrismaClient();

prisma.user.create({
  data: {
    email: "minu@gmail.com",
    name: "minu",
  },
});
