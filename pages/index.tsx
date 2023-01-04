import { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div
      className="grid min-h-screen gap-10 space-y-5 bg-slate-400 py-20 px-10 lg:grid-cols-2
    xl:grid-cols-3 xl:place-content-center"
    >
      {/* 일반적으로는 큰 화면에서 작은 화면으로 반응형 화면을 만드는데 Tailwind는 반대로
          작은 화면에서 큰 화면으로 반응형 화면을 만든다. */}
      <div
        className="flex flex-col justify-between rounded-3xl bg-white p-6 shadow-xl sm:bg-red-400 sm:hover:bg-pink-800
      md:bg-teal-400 lg:bg-indigo-400 xl:bg-yellow-400"
      >
        <span className="text-3xl font-bold">Select Item</span>
        <ul>
          {[1, 2, 3, 4, 5].map((i) => {
            return (
              // odd:bg-blue-400(홀수) even:bg-yellow-400(짝수)
              <div key={i} className="my-2 flex justify-between odd:bg-blue-400 even:bg-yellow-400">
                <span className="text-gray-500">Grey Chair</span>
                <span className="font-semibold">$19</span>
              </div>
            );
          })}
        </ul>
        <ul>
          {["a", "b", "c", ""].map((c, i) => {
            return (
              <li className="bg-red-400 py-2 empty:hidden" key={i}>
                {c}
              </li>
            );
          })}
        </ul>
        <div className="mt-2 flex justify-between border-t-2 border-dashed pt-2">
          <span>Total</span>
          <span className="font-semibold">$19</span>
        </div>
        <button
          className="mx-auto mt-5 flex w-2/4 justify-center rounded-xl bg-blue-500
          p-3 text-center text-white transition-colors
          hover:bg-teal-500 hover:text-black focus:bg-red-500 active:bg-yellow-500"
        >
          Checkout
        </button>
      </div>

      <div className=" group overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* portrait:bg-indigo-400(세로모드) landscape:bg-teal-400(가로모드) */}
        <div className="p-6 pb-14 xl:pb-40 portrait:bg-indigo-400 landscape:bg-teal-400">
          <span className="text-2xl text-white">Profile</span>
        </div>
        <div className="relative -top-5 rounded-3xl bg-white p-6">
          <div className="relative -top-16 flex items-end justify-between">
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-500">Orders</span>
              <span className="font-bold">340</span>
            </div>
            <div className="h-24 w-24 rounded-full bg-slate-400 transition-colors group-hover:bg-red-400" />
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-500">Spent</span>
              <span className="font-bold">$2,310</span>
            </div>
          </div>
          <div className="relative -mt-10 -mb-5 flex flex-col items-center">
            <span className="text-lg font-bold">Tony Molloy</span>
            <span className="text-sm text-gray-500">New York, USA</span>
          </div>
        </div>
      </div>

      <div className=" rounded-2xl bg-white p-10 shadow-xl lg:col-span-2 xl:col-span-1">
        <div className="mb-5 flex items-center justify-between">
          <span>❌</span>
          <div className="space-x-3">
            <span>⭐ 4.9</span>
            <span className="rounded-md p-2 shadow-xl">💗</span>
          </div>
        </div>
        <div className="mb-5 h-80 bg-zinc-400" />
        <div className="flex flex-col">
          <span className="text-xl font-bold">Swoon Lounge</span>
          <span className="text-xs text-gray-500">Chair</span>
          <div className="mt-3 mb-5 flex items-center justify-between">
            <div className="space-x-2">
              <button className="h-5 w-5 rounded-full bg-yellow-300 ring-yellow-300 ring-offset-2 transition focus:ring-2"></button>
              <button className="h-5 w-5 rounded-full bg-indigo-300 ring-indigo-300 ring-offset-2 transition focus:ring-2"></button>
              <button className="h-5 w-5 rounded-full bg-teal-300 ring-teal-300 ring-offset-2 transition focus:ring-2"></button>
            </div>
            <div className="flex items-center space-x-5">
              <button className="flex aspect-square w-8 justify-center rounded-lg bg-blue-200 text-xl text-gray-500">
                -
              </button>
              <span>1</span>
              <button className="flex aspect-square w-8 justify-center rounded-lg bg-blue-200 text-xl text-gray-500">
                +
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">$450</span>
            <button className="rounded-lg bg-blue-500 py-2 px-8 text-center text-white">Add to Cart</button>
          </div>
        </div>
      </div>

      {/* peer는 바로 뒤 형제 요소에 CSS를 입힐 때 사용한다. 셀렉터에서 ~의 역할이다. */}
      {/* <form className="flex flex-col space-y-2">
        <input type="text" required placeholder="Username" className="peer rounded-lg border border-gray-400 p-1" />
        <span className="peer-valid:hidden peer-invalid:text-red-500">This input is invalid</span>
        <span className="peer-valid:text-teal-300 peer-invalid:hidden">Awesome username</span>
        <span className="hidden text-yellow-300 peer-hover:block">Hello</span>
        <input type="submit" value="Login" className="bg-white" />
      </form> */}

      {/* <div className="flex flex-col space-y-2 lg:col-span-2">
        <details className="select-none open:bg-indigo-500 open:text-white">
          <summary className="cursor-pointer select-none">What is my fav. food.</summary>
          <span>김치</span>
        </details>
        <ul className="list-decimal marker:text-teal-200">
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
        </ul>
        <input
          type="file"
          className="file:cursor-pointer file:rounded-xl file:border-none file:bg-purple-400
          file:px-5 file:text-white file:transition-colors file:hover:bg-white file:hover:text-purple-400"
        />
        <p className="first-letter:text-7xl first-letter:hover:text-purple-400">Hello World</p>
      </div> */}
    </div>
  );
};

export default Home;
