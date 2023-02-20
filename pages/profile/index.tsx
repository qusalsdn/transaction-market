import type { GetServerSideProps, NextPage, NextPageContext } from "next";
import Link from "next/link";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import useSWR, { SWRConfig } from "swr";
import { Review, User } from "@prisma/client";
import { cls } from "@libs/client/utils";
import Image from "next/image";
import { withSsrSession } from "@libs/server/withSession";
import client from "@libs/server/client";
import { Suspense } from "react";
import Loading from "@components/loading";

interface ReviewWithUser extends Review {
  createdBy: User;
}

interface ReviewsResponse {
  ok: boolean;
  reviews: ReviewWithUser[];
}

// 이렇게 컴포넌트 별로 나누는 이유는 SWR을 사용하면 suspense 전에 전체 페이지가 보이지 않기 때문에 네비게이션 바를 볼 수가 없다.
// const Reviews = () => {
//   const { data } = useSWR<ReviewsResponse>("/api/reviews");
//   return (
//     <>
//       {data?.reviews?.map((review) => (
//         <div key={review.id} className="mt-12">
//           <div className="flex items-center space-x-4">
//             <div className="h-12 w-12 rounded-full bg-slate-500" />
//             <div>
//               <h4 className="text-sm font-bold text-gray-800">
//                 {review?.createdBy?.name}
//               </h4>
//               <div className="flex items-center">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <svg
//                     key={star}
//                     className={cls(
//                       "h-5 w-5",
//                       review.socre >= star ? "text-orange-400" : "text-gray-400"
//                     )}
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                     aria-hidden="true"
//                   >
//                     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                   </svg>
//                 ))}
//               </div>
//             </div>
//           </div>
//           <div className="mt-4 text-sm text-gray-600">
//             <p>{review?.review}</p>
//           </div>
//         </div>
//       ))}
//     </>
//   );
// };

// const MiniProfile = () => {
//   const { user } = useUser();
//   return (
//     <div className="mt-4 flex items-center space-x-3">
//       {user?.avatar ? (
//         <Image
//           src={`https://imagedelivery.net/zbviVI8oDmIX5FtWyQ7S9g/${user?.avatar}/avatar`}
//           alt="avatar"
//           className="h-16 w-16 rounded-full bg-slate-500"
//           width={64}
//           height={64}
//         />
//       ) : (
//         <div className="h-16 w-16 rounded-full bg-slate-500" />
//       )}
//       <div className="flex flex-col">
//         <span className="font-medium text-gray-900">{user?.name}</span>
//         <Link href="/profile/edit" className="text-sm text-gray-700">
//           내 정보 수정 &rarr;
//         </Link>
//       </div>
//     </div>
//   );
// };

const Profile: NextPage = () => {
  const { user } = useUser();
  const { data, isLoading } = useSWR<ReviewsResponse>("/api/reviews");
  console.log(data?.reviews);

  return (
    <Layout hasTabBar title="나의 캐럿" seoTitle="프로필">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="px-4">
          <div className="mt-4 flex items-center space-x-3">
            {user?.avatar ? (
              <Image
                src={`https://imagedelivery.net/zbviVI8oDmIX5FtWyQ7S9g/${user?.avatar}/avatar`}
                alt="avatar"
                className="h-16 w-16 rounded-full bg-slate-500"
                width={64}
                height={64}
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-slate-500" />
            )}
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">{user?.name}</span>
              <Link href="/profile/edit" className="text-sm text-gray-700">
                내 정보 수정 &rarr;
              </Link>
            </div>
          </div>
          {/* <Suspense fallback="사진 로딩중...">
          <MiniProfile />
        </Suspense> */}

          <div className="mt-10 flex justify-around">
            <Link href="/profile/sold" className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-400 text-white">
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
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
              </div>
              <span className="mt-2 text-sm font-medium text-gray-700">판매내역</span>
            </Link>

            <Link href="/profile/bought" className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-400 text-white">
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
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  ></path>
                </svg>
              </div>
              <span className="mt-2 text-sm font-medium text-gray-700">구매내역</span>
            </Link>

            <Link href="/profile/loved" className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-400 text-white">
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  ></path>
                </svg>
              </div>
              <span className="mt-2 text-sm font-medium text-gray-700">관심목록</span>
            </Link>
          </div>

          <h1 className="mt-6 text-lg font-bold">리뷰</h1>
          {data?.reviews.length !== 0 ? (
            data?.reviews?.map((review) => (
              <div key={review.id} className="mt-5">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-slate-500" />
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">
                      {review?.createdBy?.name}
                    </h4>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={cls(
                            "h-5 w-5",
                            review.socre >= star ? "text-orange-400" : "text-gray-400"
                          )}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>{review?.review}</p>
                </div>
              </div>
            ))
          ) : (
            <h1 className="mt-1">아직 리뷰가 없어요...😢</h1>
          )}
          {/* <Suspense fallback="리뷰 로딩중...">
          <Reviews />
        </Suspense> */}
        </div>
      )}
    </Layout>
  );
};

// suspense는 코드에서 로딩 상태를 나타내는 부분을 제거할 수 있게 해주는 api이다.
// suspended란 리액트가 SWR의 로딩이 끝나기 전까지 컴포넌트 렌더링을 하지 않겠다는 뜻이다.
// const Page: NextPage = () => {
//   return (
//     <SWRConfig value={{ suspense: true }}>
//       <Profile />
//     </SWRConfig>
//   );
// };

// const Page: NextPage<{ profile: User }> = ({ profile }) => {
//   return (
//     <SWRConfig value={{ fallback: { "/api/users/me": { ok: true, profile } } }}>
//       <Profile />
//     </SWRConfig>
//   );
// };

// export const getServerSideProps: GetServerSideProps = withSsrSession(async function ({
//   req,
// }: NextPageContext) {
//   const profile = await client.user.findUnique({
//     where: {
//       id: req?.session.user?.id,
//     },
//   });
//   return {
//     props: { profile: JSON.parse(JSON.stringify(profile)) },
//   };
// });

export default Profile;
