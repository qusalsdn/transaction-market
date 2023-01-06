import "../styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    // div를 중앙에 놓고 싶으면 width를 설정해 준 다음에 양쪽 margin을 auto로 설정해주면 된다.
    <div className="mx-auto w-full max-w-lg">
      <Component {...pageProps} />
    </div>
  );
}
