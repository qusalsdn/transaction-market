import { Html, Head, Main, NextScript } from "next/document";

// __app.tsx는 브라우저 실행되지만 해당 파일은 서버에서 한 번만 실행된다.
export default function Document() {
  return (
    <Html>
      <Head />
      {/* <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@500&display=swap"
          rel="stylesheet"
          />
        </Head> */}
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
