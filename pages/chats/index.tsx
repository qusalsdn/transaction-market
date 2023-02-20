import type { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/layout";
import useSWR from "swr";
import { ChatMessage, Chatroom, User } from "@prisma/client";
import useUser from "@libs/client/useUser";
import Image from "next/image";
import Loading from "@components/loading";

interface ChatRoomeWithUesr extends Chatroom {
  buyer: User;
  seller: User;
  chatMessage: ChatMessage[];
}

interface chatRoomResponse {
  ok: boolean;
  chatRooms: ChatRoomeWithUesr[];
}

const Chats: NextPage = () => {
  const { data, isLoading } = useSWR<chatRoomResponse>("/api/chats");
  const { user } = useUser();

  return (
    <Layout hasTabBar title="채팅" seoTitle="채팅 홈">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="divide-y-[1px] ">
          {data?.chatRooms?.map((chatRoom) => {
            const otherUser =
              user?.id === chatRoom.buyerId
                ? {
                    id: chatRoom.seller.id,
                    avatarUrl: chatRoom.seller.avatar,
                    name: chatRoom.seller.name,
                  }
                : {
                    id: chatRoom.buyer.id,
                    avatarUrl: chatRoom.buyer.avatar,
                    name: chatRoom.buyer.name,
                  };
            return (
              <Link
                href={`/chats/${chatRoom.id}?sellerName=${
                  user?.id === chatRoom.buyerId
                    ? chatRoom.seller.name
                    : chatRoom.buyer.name
                }`}
                key={chatRoom.id}
                className="flex cursor-pointer items-center space-x-3 px-4 py-3"
              >
                {otherUser.avatarUrl ? (
                  // 이미지를 div 컨테이너 안에 넣고 부모 컨테이너에 relative를 적용하면 이미지를 표시할 수 있다. layout이 fill일 때 자주 사용하는 패턴이다.
                  // 이미지의 크기는 컨테이너에서 margin or padding으로 지정하여 설정할 수 있다.
                  <div>
                    <Image
                      src={`https://imagedelivery.net/zbviVI8oDmIX5FtWyQ7S9g/${otherUser.avatarUrl}/avatar`}
                      alt="avatar"
                      // object-Fit을 사용하면 배경 이미지처럼 이미지를 배치할 수 있다.
                      className="rounded-full"
                      // layout을 이용하면 이미지의 width와 height을 지정할 필요가 없다.
                      // layout을 fill로 지정하면 전체 이미지를 최대한 키워주게 되고 position이 absolute로 변경되게 된다.
                      width={48}
                      height={48}
                    />
                  </div>
                ) : (
                  <div className="h-12 w-12 rounded-full bg-slate-300" />
                )}
                <div>
                  <p className="font-bold text-gray-700">{otherUser.name}</p>
                  <p className="text-sm  text-gray-500">
                    {chatRoom.chatMessage[0]?.message}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </Layout>
  );
};

export default Chats;
