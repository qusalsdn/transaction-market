import type { NextPage } from "next";
import Layout from "@components/layout";
import Message from "@components/message";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import useUser from "@libs/client/useUser";
import { ChatMessage, Chatroom, Product, User } from "@prisma/client";
import { cls } from "@libs/client/utils";
import Loading from "@components/loading";

interface ReviewCount {
  review: number;
}

interface CountWithReview {
  _count: ReviewCount;
}

interface ProductReviewResponse {
  ok: boolean;
  productReview: CountWithReview;
}

interface ChatMessageWithUser extends ChatMessage {
  user: User;
}

interface ChatRoomWithMessage extends Chatroom {
  chatMessage: ChatMessageWithUser[];
  buyer: User;
  seller: User;
  product: Product;
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
  const { data, mutate, isLoading } = useSWR<ChatRoomResponse>(
    id ? `/api/chats/${id}` : null
  );
  const { register, handleSubmit, reset } = useForm<MessageForm>();
  const [sendMessage, { data: sendMessageData, loading }] = useMutation(
    `/api/chats/${id}/messages`
  );
  const { user } = useUser();
  const { data: reviewData } = useSWR<ProductReviewResponse>(
    data?.chatRoom.productId
      ? `/api/products/review?productId=${data?.chatRoom.productId}`
      : null
  );

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

  const onReviewClick = () => {
    router.push(
      `/products/writeReview?productId=${data?.chatRoom.productId}&sellerId=${data?.chatRoom.sellerId}&buyerId=${data?.chatRoom.buyerId}`
    );
  };

  return (
    <Layout canGoBack title={sellerName} seoTitle="채팅">
      {isLoading ? (
        <Loading />
      ) : (
        data?.chatRoom.product.completed &&
        user?.id === data.chatRoom.product.doneDealId && (
          <div className="fixed mx-auto w-full max-w-xl border-b-[1px] bg-white p-2 text-center">
            <h1>상대방이 거래를 완료하였습니다.</h1>
            {reviewData?.productReview._count.review == 0 ? (
              <button
                className="rounded-md bg-orange-400 p-2 font-bold text-white"
                onClick={onReviewClick}
              >
                리뷰 작성하기 !
              </button>
            ) : (
              <div className="flex items-center justify-center">
                <p className="max-w-[150px] rounded-md bg-orange-400 p-2 font-bold text-white">
                  리뷰작성 완료 !
                </p>
              </div>
            )}
          </div>
        )
      )}
      <div
        className={cls(
          data?.chatRoom.product.completed &&
            user?.id === data?.chatRoom.product.doneDealId
            ? "mt-14"
            : "",
          `space-y-4 py-10 px-4 pb-16`
        )}
      >
        {data?.chatRoom?.chatMessage?.map((message) => (
          <Message
            key={message.id}
            message={message.message}
            reversed={user?.id === message.user.id ? true : false}
            avatarUrl={message?.user?.avatar}
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
