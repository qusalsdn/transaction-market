import type { NextPage } from "next";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { Answer, Post, User } from "@prisma/client";
import Link from "next/link";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import { useForm } from "react-hook-form";
import Image from "next/image";
import Loading from "@components/loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import useUser from "@libs/client/useUser";
import Button from "@components/button";

interface UpdateWithDeletePost {
  ok: boolean;
}

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

interface AnswerForm {
  answer: string;
  title: string;
  question: string;
}

interface AnswerResponse {
  ok: boolean;
  response: Answer;
}

const CommunityPostDetail: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { data, mutate, isLoading } = useSWR<CommunityPostResponse>(
    router.query.id ? `/api/posts/${router.query.id}` : null
  );
  const [wonder, { loading }] = useMutation(`/api/posts/${router.query.id}/wonder`);
  const [sendAnswer, { data: answerData, loading: answerLoading }] =
    useMutation<AnswerResponse>(`/api/posts/${router.query.id}/answers`);
  const { register, handleSubmit, reset } = useForm<AnswerForm>();

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
    // 무한 클릭으로 인한 데이터 병목현상 방지
    if (!loading) {
      wonder({});
    }
  };

  const onValid = (data: AnswerForm) => {
    if (answerLoading) return;
    sendAnswer(data);
  };

  useEffect(() => {
    if (answerData && answerData.ok) {
      reset();
      // 아래의 코드로 인해 refech를 수행하게 되고 답변을 입력하면 실시간으로 답글이 달리는 것처럼 구현할 수 있다.
      mutate();
    }
  }, [answerData, reset, mutate]);

  const [editTextArea, setEditTextArea] = useState(false);
  const [updatePost, { data: updatePostData, loading: updatePostLoading }] =
    useMutation<UpdateWithDeletePost>(`/api/posts/${data?.post.id}/update`);
  const [deletePost, { data: deletePostData, loading: deletePostLoading }] =
    useMutation<UpdateWithDeletePost>(`/api/posts/${data?.post.id}/delete`);
  const onEditValid = (data: AnswerForm) => {
    const title = data.title;
    const question = data.question;
    updatePost({ title, question }, "PUT");
  };
  const onEditClick = () => {
    const result = window.confirm("게시물을 수정하시겠습니까?");
    if (result) setEditTextArea(true);
  };
  const onDeleteClick = () => {
    const result = window.confirm("게시물을 삭제하시겠습니까?");
    if (result) deletePost({}, "DELETE");
  };
  useEffect(() => {
    if (deletePostData?.ok) router.push("/community");
  }, [deletePostData, router]);

  return (
    <Layout canGoBack seoTitle="커뮤니티">
      {isLoading ? (
        <Loading />
      ) : editTextArea && !updatePostData?.ok ? (
        <div>
          <form onSubmit={handleSubmit(onEditValid)} className="space-y-4 p-4">
            <TextArea
              required
              placeholder="수정할 제목을 입력하세요."
              register={register("title", {
                required: true,
                minLength: 5,
                maxLength: 20,
              })}
              beforeValue={data?.post.title}
            />
            <TextArea
              required
              placeholder="수정할 질문을 입력하세요."
              register={register("question", { required: true, minLength: 5 })}
              beforeValue={data?.post.question}
            />
            <Button text={updatePostLoading ? "로딩중..." : "완료"} />
          </form>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between">
            <span className="my-3 ml-4 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
              동네질문
            </span>
            {data?.post.userId === user?.id && (
              <div className="space-x-4">
                <button onClick={onEditClick}>
                  <FontAwesomeIcon icon={faPen} className="text-2xl text-orange-400" />
                </button>
                <button onClick={onDeleteClick}>
                  <FontAwesomeIcon
                    icon={faTrashCan}
                    className="text-2xl text-orange-400"
                  />
                </button>
              </div>
            )}
          </div>

          <div className="flex cursor-pointer items-center space-x-3 px-4 pb-3">
            {data?.post.user.avatar ? (
              <Image
                alt="avatar"
                src={`https://imagedelivery.net/zbviVI8oDmIX5FtWyQ7S9g/${data.post.user.avatar}/avatar`}
                width={40}
                height={40}
                className="rounded-full bg-slate-300"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-slate-300" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-700">
                {data?.post?.user?.name}
              </p>
              <Link href={`/profile/${data?.post?.user?.id}`}>
                <p className="text-xs font-medium text-gray-500">프로필 &rarr;</p>
              </Link>
            </div>
          </div>

          <div>
            <div className="mt-2 px-4 text-gray-700">
              <span className="font-bold text-orange-500">Q </span>
              <span className="font-bold">{data?.post?.title}</span>
              <p className="mt-2">{data?.post.question}</p>
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
                <span>궁금해요 {data?.post?._count?.wondering}</span>
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
                <span>답변 {data?.post?._count?.answers}</span>
              </span>
            </div>
          </div>

          <div className="my-5 space-y-5 px-4">
            {data?.post?.answers.map((answer) => (
              <div key={answer.id} className="flex items-start space-x-3">
                {answer.user.avatar ? (
                  <Image
                    alt="avatar"
                    src={`https://imagedelivery.net/zbviVI8oDmIX5FtWyQ7S9g/${answer.user.avatar}/avatar`}
                    width={32}
                    height={32}
                    className="rounded-full bg-slate-300"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-slate-200" />
                )}
                <div>
                  <span className="block text-sm font-medium text-gray-700">
                    {answer.user.name}
                  </span>
                  <span className="block text-xs text-gray-500 ">
                    {answer.createdAt?.toString()}
                  </span>
                  <p className="mt-2 text-gray-700">{answer.answer}</p>
                </div>
              </div>
            ))}
          </div>

          <form className="px-4" onSubmit={handleSubmit(onValid)}>
            <TextArea
              name="description"
              placeholder="답변을 입력하세요."
              required
              register={register("answer", { required: true, minLength: 5 })}
            />
            <button className="mt-2 w-full rounded-md border border-transparent bg-orange-400 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ">
              {answerLoading ? "로딩중..." : "답변"}
            </button>
          </form>
        </div>
      )}
    </Layout>
  );
};

export default CommunityPostDetail;
