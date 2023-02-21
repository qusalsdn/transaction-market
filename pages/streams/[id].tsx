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
import Loading from "@components/loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { cls } from "@libs/client/utils";

interface DeleteStreamResponse {
  ok: boolean;
}

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
  const { data, mutate, isLoading } = useSWR<StreamResponse>(
    id ? `/api/streams/${id}` : null,
    {
      refreshInterval: 1000,
    }
  );
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

  const [deleteStream, { data: deleteStreamData }] = useMutation<DeleteStreamResponse>(
    `/api/streams/${router.query.id}/delete`
  );
  useEffect(() => {
    if (deleteStreamData?.ok) router.push("/streams");
  }, [deleteStreamData, router]);
  const onStreamDeleteClick = () => {
    const result = window.confirm("해당 스트리밍을 삭제하시겠습니까?");
    if (result) deleteStream({}, "DELETE");
  };

  const onStreamEnd = () => {
    const result = window.confirm(
      "스트리밍을 종료하면 해당 스트리밍을 수정 및 삭제를 하지 못합니다. 그래도 종료하시겠습니까?"
    );
    if (result) deleteStream({}, "PUT");
  };

  return (
    <Layout canGoBack seoTitle="라이브 스트림">
      {isLoading ? (
        <Loading />
      ) : (
        <div
          className={cls(
            "space-y-4 px-4",
            data?.stream?.userId === user?.id || data?.stream.completed ? "" : "py-10"
          )}
        >
          {data?.stream.completed && (
            <div className="mt-4 flex">
              <h1 className="rounded-md bg-orange-400 px-2 py-1 font-bold text-white">
                스트리밍 종료됨
              </h1>
            </div>
          )}
          {data?.stream?.userId === user?.id && !data?.stream.completed ? (
            <div className="mt-5 flex items-center justify-between">
              <div>
                <button
                  className="rounded-md bg-orange-400 px-2 py-1 font-bold text-white"
                  onClick={onStreamEnd}
                >
                  스트리밍 종료
                </button>
              </div>
              <div className="space-x-4 text-end">
                <button
                  onClick={() => router.push(`/streams/edit?id=${router.query.id}`)}
                >
                  <FontAwesomeIcon icon={faPen} className="text-2xl text-orange-400" />
                </button>
                <button onClick={onStreamDeleteClick}>
                  <FontAwesomeIcon
                    icon={faTrashCan}
                    className="text-2xl text-orange-400"
                  />
                </button>
              </div>
            </div>
          ) : null}
          {data?.stream?.cloudflareId ? (
            <iframe
              src={`https://iframe.videodelivery.net/${data?.stream?.cloudflareId}`}
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
                {data?.stream?.cloudflareUrl}
              </span>
              <span className="text-gray-100">
                <p>Key</p>
                {data?.stream?.cloudflareKey}
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">라이브 채팅</h2>
            <div className="h-[50vh] space-y-4 overflow-y-scroll py-10  px-4 pb-16">
              {data?.stream?.messages.map((message) => (
                <Message
                  key={message.id}
                  message={message.message}
                  reversed={user?.id === message.user.id ? true : false}
                  avatarUrl={message.user.avatar}
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
      )}
    </Layout>
  );
};

export default SelectStream;
