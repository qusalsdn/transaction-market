import type { GetStaticProps, NextPage, NextPageContext } from "next";
import Link from "next/link";
import FloatingButton from "@components/floating-button";
import Layout from "@components/layout";
import useSWR from "swr";
import { Post, User } from "@prisma/client";
import useCoords from "@libs/client/useCoords";
import client from "@libs/server/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Pagination from "@components/pagination";
import { NextRequest } from "next/server";

interface PostWithUser extends Post {
  user: User;
  _count: {
    wondering: number;
    answers: number;
  };
}

interface PostsResponse {
  ok: boolean;
  posts: PostWithUser[];
}

const Community: NextPage<PostsResponse> = () => {
  const [page, setPage] = useState(1);
  const router = useRouter();
  const { latitude, longitude } = useCoords();
  const { data } = useSWR<PostsResponse>(
    latitude && longitude
      ? `/api/posts?latitude=${latitude}&longitude=${longitude}&page=${page}`
      : null
  );

  useEffect(() => {
    if (router.query.page) {
      setPage(Number(router.query.page));
    }
  }, [page, router]);

  return (
    <Layout hasTabBar title="동네생활" seoTitle="커뮤니티 홈">
      <div className="space-y-4 divide-y-[1px]">
        {data?.posts?.map((post) => (
          <Link
            key={post.id}
            href={`/community/${post.id}`}
            className="flex cursor-pointer flex-col items-start pt-4"
          >
            <span className="ml-4 flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
              동네질문
            </span>
            <div className="mt-2 px-4 text-gray-700">
              <span className="font-medium text-orange-400">Q </span>
              <span className="font-bold">{post.title}</span>
            </div>
            <div className="mt-5 flex w-full items-center justify-between px-4 text-xs font-medium text-gray-500">
              <span>{post.user.name}</span>
              <span>{post.createdAt.toString()}</span>
            </div>
            <div className="flex w-full space-x-5 px-4 py-2.5 text-gray-700">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>궁금해요 {post?._count?.wondering}</span>
              </span>
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
                <span>답변 {post?._count?.answers}</span>
              </span>
            </div>
          </Link>
        ))}

        <FloatingButton href="/community/write">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            ></path>
          </svg>
        </FloatingButton>
        <Pagination page={page} countProduct={data?.posts.length} />
      </div>
    </Layout>
  );
};

// getStaticProps은 프로젝트를 빌드할 때만 데이터가 생성되지만 ISR을 이용하면 정적 페이지를 개별적으로 다시 생성할 수 있다.
// export const getStaticProps: GetStaticProps = async (context) => {
//   console.log("정적으로 동네생활 생성 중...");
//   const posts = await client.post.findMany({ include: { user: true } });
//   return {
//     props: { posts: JSON.parse(JSON.stringify(posts)) },
//     // revalidate를 설정해주면 빌드하고 일정 시간이 지나면 이 페이지의 html을 다시 빌드하겠다고 설정할 수 있다.
//     // revalidate: 60,
//   };
// };

export default Community;
