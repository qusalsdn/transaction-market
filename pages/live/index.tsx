import { NextPage } from "next";

const Live: NextPage = () => {
  return (
    <div className="space-y-4 divide-y-2 py-10">
      {[1, 2, 3, 4, 5].map((_, i) => {
        return (
          <div key={i} className="px-4 pt-4">
            {/* aspect-video를 사용하면 높이가 즉시 비디오 비율에 맞게 자동으로 조정이 된다. */}
            {/* 만약 높이를 신경쓰고 싶지 않다면 그냥 aspect-square를 사용하면 된다. */}
            <h3 className="mt-2 text-lg font-bold text-gray-800">Let&apos;s try prtatos</h3>
            <div className="aspect-video w-full rounded-md bg-slate-400 shadow-md" />
          </div>
        );
      })}
      <button
        className="fixed bottom-24 right-5 rounded-full border-transparent bg-orange-400 p-4 text-white
         shadow-xl transition-colors hover:bg-orange-500"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          ></path>
        </svg>
      </button>
    </div>
  );
};

export default Live;
