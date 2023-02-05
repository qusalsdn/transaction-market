import type { NextPage } from "next";
import Layout from "@components/layout";
import Message from "@components/message";
import useSWR from "swr";
import { useRouter } from "next/router";
import { Stream } from "@prisma/client";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import useUser from "@libs/client/useUser";
import { useEffect } from "react";

interface StreamMessage {
  id: number;
  message: string;
  user: {
    id: number;
    avatar?: string;
  };
}

interface StreamWithMessage extends Stream {
  messages: StreamMessage[];
}

interface StreamResponse {
  ok: true;
  stream: StreamWithMessage;
}

interface MessageForm {
  message: string;
}

const SelectStream: NextPage = () => {
  const router = useRouter();
  const {
    query: { id },
  } = router;
  const { data, mutate } = useSWR<StreamResponse>(id ? `/api/streams/${id}` : null, {
    refreshInterval: 1000,
  });
  const { register, handleSubmit, reset } = useForm<MessageForm>();
  const [sendMessage, { data: sendMessageData, loading }] = useMutation(
    `/api/streams/${id}/messages`
  );
  const { user } = useUser();

  const onValid = (data: MessageForm) => {
    if (loading) return;
    mutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          stream: {
            ...prev.stream,
            messages: [
              ...prev.stream.messages,
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
    <Layout canGoBack seoTitle="라이브 스트림">
      <div className="space-y-4 py-10  px-4">
        {data?.stream.cloudflareId ? (
          <iframe
            src={`https://iframe.videodelivery.net/${data?.stream.cloudflareId}`}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen={true}
            id="stream-player"
            className="aspect-video w-full rounded-md shadow-lg"
          ></iframe>
        ) : null}
        <div className="mt-5">
          <h1 className="text-3xl font-bold text-gray-900">{data?.stream?.name}</h1>
          <span className="mt-3 block text-2xl font-bold text-gray-900">
            {data?.stream?.price.toLocaleString("ko-KR")}원
          </span>
          <p className=" my-6 text-gray-700">{data?.stream?.description}</p>
          <div className="flex flex-col space-y-3 overflow-scroll rounded-md bg-orange-400 p-3">
            <span className="text-gray-100">스트리밍 키 (Secret)</span>
            <span className="text-gray-100">
              <p>URL</p>
              {data?.stream.cloudflareUrl}
            </span>
            <span className="text-gray-100">
              <p>Key</p>
              {data?.stream.cloudflareKey}
            </span>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900">라이브 채팅</h2>
          <div className="h-[50vh] space-y-4 overflow-y-scroll py-10  px-4 pb-16">
            {data?.stream.messages.map((message) => (
              <Message
                key={message.id}
                message={message.message}
                reversed={user?.id === message.user.id ? true : false}
              />
            ))}
          </div>
          <div className="fixed inset-x-0 bottom-0  bg-white py-2">
            <form
              onSubmit={handleSubmit(onValid)}
              className="relative mx-auto flex w-full  max-w-md items-center"
            >
              <input
                type="text"
                {...register("message", { required: true })}
                className="w-full rounded-full border-gray-300 pr-12 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              />
              <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                <button className="flex items-center rounded-full bg-orange-500 px-3 text-sm text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                  &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SelectStream;
