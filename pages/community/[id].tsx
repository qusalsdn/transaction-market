import type { NextPage } from "next";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useEffect } from "react";
import { Answer, Post, User } from "@prisma/client";
import Link from "next/link";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";

interface AnswerWithUser extends Answer {
  user: User;
}

interface PostWithUser extends Post {
  user: User;
  _count: {
    answers: number;
    wondering: number;
  };
  answers: AnswerWithUser[];
}

interface CommunityPostResponse {
  ok: boolean;
  post: PostWithUser;
  isWondering: boolean;
}

const CommunityPostDetail: NextPage = () => {
  const router = useRouter();
  const { data, mutate } = useSWR<CommunityPostResponse>(
    router.query.id ? `/api/posts/${router.query.id}` : null
  );
  const [wonder] = useMutation(`/api/posts/${router.query.id}/wonder`);

  useEffect(() => {
    if (data && !data?.ok) {
      router.push("/community");
    }
  }, [data, router]);

  const onWonderClick = () => {
    if (!data) return;
    mutate(
      {
        ...data,
        post: {
          ...data.post,
          _count: {
            ...data.post._count,
            wondering: data.isWondering
              ? data.post._count.wondering - 1
              : data.post._count.wondering + 1,
          },
        },
        isWondering: !data.isWondering,
      },
      false
    );
    wonder({});
  };

  return (
    <Layout canGoBack>
      <div>
        <span className="my-3 ml-4 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
          동네질문
        </span>

        <div className="flex cursor-pointer items-center space-x-3 px-4 pb-3">
          <div className="h-10 w-10 rounded-full bg-slate-300" />
          <div>
            <p className="text-sm font-medium text-gray-700">{data?.post.user.name}</p>
            <Link href={`/users/profiles/${data?.post?.user?.id}`}>
              <p className="text-xs font-medium text-gray-500">프로필 &rarr;</p>
            </Link>
          </div>
        </div>

        <div>
          <div className="mt-2 px-4 text-gray-700">
            <span className="font-medium text-orange-500">Q </span>
            <span>{data?.post.question}</span>
          </div>
          <div className="mt-1 flex w-full space-x-5 border-b-[1px] px-4 py-2.5  text-gray-700">
            <button
              onClick={onWonderClick}
              className="flex items-center space-x-2 text-sm"
            >
              <svg
                className={cls("h-4 w-4", data?.isWondering ? "text-orange-500" : "")}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>궁금해요 {data?.post._count.wondering}</span>
            </button>
            <span className="flex items-center space-x-2 text-sm">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                ></path>
              </svg>
              <span>답변 {data?.post._count.answers}</span>
            </span>
          </div>
        </div>

        <div className="my-5 space-y-5 px-4">
          {data?.post.answers.map((answer) => (
            <div key={answer.id} className="flex items-start space-x-3">
              <div className="h-8 w-8 rounded-full bg-slate-200" />
              <div>
                <span className="block text-sm font-medium text-gray-700">
                  {answer.user.name}
                </span>
                <span className="block text-xs text-gray-500 ">{answer.createdAt}</span>
                <p className="mt-2 text-gray-700">{}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="px-4">
          <TextArea name="description" placeholder="답변을 입력하세요." required />
          <button className="mt-2 w-full rounded-md border border-transparent bg-orange-400 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ">
            답변
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default CommunityPostDetail;
