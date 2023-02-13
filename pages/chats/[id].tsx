import type { NextPage } from "next";
import Layout from "@components/layout";
import Message from "@components/message";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import useUser from "@libs/client/useUser";
import { ChatMessage, Chatroom, User } from "@prisma/client";

interface ChatMessageWithUser extends ChatMessage {
  user: User;
}

interface ChatRoomWithMessage extends Chatroom {
  chatMessage: ChatMessageWithUser[];
  buyer: User;
  seller: User;
}

interface ChatRoomResponse {
  ok: true;
  chatRoom: ChatRoomWithMessage;
}

interface MessageForm {
  message: string;
}

const ChatDetail: NextPage = () => {
  const router = useRouter();
  const {
    query: { id, sellerName },
  } = router;
  const { data, mutate } = useSWR<ChatRoomResponse>(id ? `/api/chats/${id}` : null, {
    refreshInterval: 1000,
  });
  const { register, handleSubmit, reset } = useForm<MessageForm>();
  const [sendMessage, { data: sendMessageData, loading }] = useMutation(
    `/api/chats/${id}/messages`
  );
  const { user } = useUser();

  const onValid = (data: MessageForm) => {
    if (loading) return;
    mutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          chatroom: {
            ...prev.chatRoom,
            messages: [
              ...prev.chatRoom.chatMessage,
              {
                id: Date.now(),
                message: data.message,
                user: {
                  ...user,
                },
              },
            ],
          },
        } as any),
      false
    );
    sendMessage(data);
    reset();
  };

  return (
    <Layout canGoBack title={sellerName} seoTitle="채팅">
      <div className="space-y-4 py-10 px-4 pb-16">
        {data?.chatRoom?.chatMessage?.map((message) => (
          <Message
            key={message.id}
            message={message.message}
            reversed={user?.id === message.user.id ? true : false}
            avatarUrl={message.user.avatar}
          />
        ))}
        <form
          className="fixed inset-x-0 bottom-0 bg-white py-2"
          onSubmit={handleSubmit(onValid)}
        >
          <div className="relative mx-auto flex w-full max-w-md items-center">
            <input
              type="text"
              {...register("message", { required: true })}
              className="w-full rounded-full border-gray-300 pr-12 shadow-md focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            />
            <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
              <button className="flex items-center rounded-full bg-orange-500 px-3 text-sm text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                &rarr;
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ChatDetail;
