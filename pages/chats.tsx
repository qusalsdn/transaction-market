import type { NextPage } from "next";

const Chats: NextPage = () => {
  return (
    // divide는 어떤 요소의 옆에 형제 요소가 있으면 border를 넣어준다.
    // 그러기 때문에 마지막 요소는 아래(형제) 요소가 없으니까 아래쪽에 border가 없게 된다.
    <div className="divide-y-[1px] py-10">
      {[1, 1, 1, 1, 1, 1, 1].map((_, i) => (
        <div key={i} className="flex cursor-pointer items-center space-x-3 px-4 py-3">
          <div className="h-12 w-12 rounded-full bg-slate-300" />
          <div>
            <p className="text-gray-700">Steve Jebs</p>
            <p className="text-sm  text-gray-500">See you tomorrow in the corner at 2pm!</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
