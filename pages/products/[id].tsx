import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import Link from "next/link";
import { Chatroom, Product, User } from "@prisma/client";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import Image from "next/image";
import client from "@libs/server/client";
import useUser from "@libs/client/useUser";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";

interface ProductCompletedResponse {
  ok: boolean;
}

interface ChatRoomWithUser extends Chatroom {
  buyer: User;
}

interface ProductWithUser extends Product {
  user: User;
  chatRoom: ChatRoomWithUser[];
}

interface ItemDetailResponse {
  ok: boolean;
  product: ProductWithUser;
  relatedProducts: Product[];
  isLiked: boolean;
}

interface ChatRoomResponse {
  ok: boolean;
  chatRoomId: number;
  checkRoom: boolean;
  error: string;
}

interface DeleteProductResponse {
  ok: boolean;
}

const ItemDetail: NextPage = () => {
  const router = useRouter();
  // useSWR을 사용할 때 optional query는 아래처럼 구현한다.
  const { data, mutate: boundMutate } = useSWR<ItemDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );
  const [toggleFav] = useMutation(`/api/products/${router.query.id}/fav`);
  const { mutate } = useSWRConfig();
  const { user } = useUser();
  const [createChatRoom, { data: chatRoomData, loading: chatRoomLoading }] =
    useMutation<ChatRoomResponse>(
      `/api/chats?productId=${data?.product?.id}&buyerId=${user?.id}&sellerId=${data?.product?.user.id}`
    );
  const [deleteProduct, { data: deleteProductData, loading: deleteProductLoading }] =
    useMutation<DeleteProductResponse>(
      `/api/products/${router.query.id}/delete?imageId=${data?.product?.image}`
    );

  const onFavClick = () => {
    if (!data) return;
    // bound Mutations의 첫 번째 인자는 변경하는 값 즉, 유저에게 화면UI의 변경사항을 보여주기 위한 부분이고 두 번째 인자는 변경이 일어난 후에 다시 API에서 데이터를 불러올지를 결정하는 부분이다.
    // 정리하자면 첫 번째 인자에는 가짜 데이터를 놓고 두 번째 인자가 true면 SWR이 다시 진짜 데이터를 찾아서 불러온다.
    boundMutate((prev) => prev && { ...data, isLiked: !data.isLiked }, false);
    // unbound Mutations는 다른 화면의 데이터를 변경하고 싶을 때 즉,  SWR 캐시의 데이터를 원하는 아무곳에서나 mutate 할 수 있다.
    // mutate("/api/users/me", { ok: false }, false); // key 값 뒤로 인자를 없이 mutate 하게 되면 refetch를 할 수 있게 된다.
    toggleFav({});
  };

  const onChatClick = () => {
    const result = window.confirm("채팅방이 생성됩니다. 수락하시겠습니까?");
    if (result) {
      createChatRoom({});
    }
  };

  const onEditClick = () => {
    const result = window.confirm("게시물을 수정하시겠습니까?");
    if (result) {
      router.push(`/products/edit/${data?.product.id}`);
    }
  };

  const onDeleteClick = () => {
    const result = window.confirm("게시물을 삭제하시겠습니까?");
    if (result) {
      deleteProduct({}, "DELETE");
    }
  };

  const [buyerId, setBuyerId] = useState("");
  const [
    productCompleted,
    { data: CompletedResponseData, loading: CompletedResponseLoading },
  ] = useMutation<ProductCompletedResponse>(
    `/api/products/${router.query.id}/update?completed=completed`
  );
  const onBuyerIdChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const {
      target: { value },
    } = event;
    setBuyerId(value);
  };
  const onProductStateClick = () => {
    if (!buyerId) {
      return window.alert("구매자와의 채팅방이 없거나 구매자를 선택하지 않았습니다.");
    }
    const result = window.confirm(
      "거래완료를 선택하면 리뷰 때문에 돌이킬 수 없습니다. 거래완료를 하시겠습니까?"
    );
    if (result) {
      productCompleted({ doneDealId: buyerId }, "PUT");
    }
  };

  useEffect(() => {
    if (chatRoomData?.ok) {
      router.push(`/chats/${chatRoomData.chatRoomId}`);
    }
    if (!chatRoomData?.ok && chatRoomData?.chatRoomId) {
      window.alert("이미 제품에 대한 채팅방이 존재하여 해당 채팅방으로 이동합니다.");
      router.push(`/chats/${chatRoomData.chatRoomId}`);
    }
    if (chatRoomData?.error) window.alert(chatRoomData.error);
  }, [chatRoomData, router]);

  useEffect(() => {
    if (deleteProductData?.ok) {
      router.push("/");
    }
  }, [deleteProductData, router]);

  return (
    <Layout canGoBack seoTitle="제품 상세">
      <div className="px-4  py-4">
        <div className="mb-8">
          <div className="mb-3">
            {user?.id === data?.product.userId ? (
              <div className="flex items-center justify-between">
                {!data?.product.completed ? (
                  !CompletedResponseData?.ok && (
                    <div className="flex space-x-2">
                      <button
                        className="rounded-md bg-orange-400 p-3 font-bold text-white"
                        onClick={onProductStateClick}
                      >
                        {CompletedResponseLoading ? "로딩중..." : "거래완료"}
                      </button>
                      <div className="flex flex-col">
                        <label className="text-sm">
                          거래를 완료할 상대를 선택해주세요.
                        </label>
                        <select
                          className="p-0 text-center"
                          required
                          onChange={onBuyerIdChange}
                        >
                          <option value="">상대방 선택하기</option>
                          {data?.product.chatRoom?.map((user) => {
                            return (
                              <option value={user.buyer.id} key={user.buyer.id}>
                                {user.buyer.name}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  )
                ) : (
                  <p className="rounded-md bg-orange-400 p-2 font-bold text-white">
                    거래완료 상품입니다.
                  </p>
                )}

                {!data?.product.completed && !CompletedResponseData?.ok && (
                  <div className="space-x-4">
                    <button onClick={onEditClick}>
                      <FontAwesomeIcon
                        icon={faPen}
                        className="text-2xl text-orange-400"
                      />
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
            ) : null}
          </div>
          {data?.product.image ? (
            // 이미지를 div 컨테이너 안에 넣고 부모 컨테이너에 relative를 적용하면 이미지를 표시할 수 있다. layout이 fill일 때 자주 사용하는 패턴이다.
            // 이미지의 크기는 컨테이너에서 margin or padding으로 지정하여 설정할 수 있다.
            <div className="relative pb-80">
              <Image
                src={`https://imagedelivery.net/zbviVI8oDmIX5FtWyQ7S9g/${data?.product.image}/public`}
                alt="product"
                // object-Fit을 사용하면 배경 이미지처럼 이미지를 배치할 수 있다.
                className="bg-slate-300 object-contain"
                // layout을 이용하면 이미지의 width와 height을 지정할 필요가 없다.
                // layout을 fill로 지정하면 전체 이미지를 최대한 키워주게 되고 position이 absolute로 변경되게 된다.
                fill
              />
            </div>
          ) : (
            <div className="h-96 bg-slate-300" />
          )}
          <div className="flex cursor-pointer items-center space-x-3 border-t border-b py-3">
            {data?.product.user.avatar ? (
              <Image
                src={`https://imagedelivery.net/zbviVI8oDmIX5FtWyQ7S9g/${data?.product.user.avatar}/avatar`}
                alt="avatar"
                className="h-12 w-12 cursor-default rounded-full bg-slate-300"
                width={48}
                height={48}
              />
            ) : (
              <div className="h-12 w-12 cursor-default rounded-full bg-slate-300" />
            )}
            <div>
              <p className="cursor-default text-sm font-medium text-gray-700">
                {data?.product?.user?.name}
              </p>
              <Link
                href={`/profile/${data?.product?.user?.id}`}
                className="text-xs font-medium text-gray-500"
              >
                View profile &rarr;
              </Link>
            </div>
          </div>

          <div className="mt-5">
            <h1 className="text-3xl font-bold text-gray-900">{data?.product?.name}</h1>
            <span className="mt-3 block text-2xl font-bold text-gray-900">
              {`${data?.product?.price.toLocaleString("ko-KR")}원`}
            </span>
            <p className=" my-6 text-gray-700">{data?.product?.description}</p>

            <div className="flex items-center justify-between space-x-2">
              <Button
                large
                text={chatRoomLoading || deleteProductLoading ? "로딩중..." : "채팅하기"}
                onClick={onChatClick}
              />
              <button
                onClick={onFavClick}
                className={cls(
                  "flex items-center justify-center rounded-md p-3 transition-colors hover:bg-gray-100",
                  data?.isLiked
                    ? "text-red-400 hover:text-gray-400"
                    : "text-gray-400 hover:text-red-400"
                )}
              >
                {data?.isLiked ? (
                  <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="h-6 w-6"
                  >
                    <path
                      clipRule="evenodd"
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
          <div className=" mt-6 grid grid-cols-2 gap-4">
            {data?.relatedProducts?.map((product) => (
              <div key={product.id}>
                <Link href={`/products/${product.id}`}>
                  {product.image ? (
                    <Image
                      src={`https://imagedelivery.net/zbviVI8oDmIX5FtWyQ7S9g/${product.image}/product`}
                      alt="product"
                      className="mb-4 h-56 w-full bg-slate-300"
                      width={221}
                      height={224}
                    />
                  ) : (
                    <div className="mb-4 h-56 w-full bg-slate-300" />
                  )}
                  <h3 className="-mb-1 text-gray-700">{product.name}</h3>
                  <span className="text-sm font-bold text-gray-900">
                    {product.price.toLocaleString("ko-KR")}원
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

// 동적 페이지를 정적 페이지로 변환하는 방법
// export const getStaticPaths: GetStaticPaths = () => {
//   return {
//     paths: [],
//     // fallback은 유저가 getStaticProps나 getStaticPaths를 가지고 있는 페이지를 방문할 때에 그 페이지에 해당하는
//     // HTML 파일이 없다면 'blocking'일 경우 유저가 잠시 기다리게 만들고 fallback blocking이 그동안 백그라운드에서
//     // 페이지를 만들어서 유저에게 넘겨준다. 이렇기 때문에 프로젝트를 빌드할 때 모든 상품의 id에 대한 페이지를 미리 만들어두지 않아도 된다.
//     // fallback이 false일 경우에는 준비된 HTML이 없으면 유저가 404 응답을 받게 된다.
//     // fallbackdl true일 경우에는 request 타임에 페이지를 생성할 수 있게 해주고 페이지를 생성하는 동안에 유저가 뭔가를 보여줄 수 있도록 해준다.
//     fallback: "blocking",
//   };
// };

// export const getStaticProps: GetStaticProps = async (ctx) => {
//   if (!ctx.params?.id) {
//     return {
//       props: {},
//     };
//   }
//   const product = await client.product.findUnique({
//     where: {
//       id: Number(ctx.params.id),
//     },
//     include: {
//       user: {
//         select: {
//           id: true,
//           name: true,
//           avatar: true,
//         },
//       },
//       chatRoom: {
//         select: {
//           buyer: {
//             select: {
//               id: true,
//               name: true,
//             },
//           },
//         },
//       },
//     },
//   });
//   const terms = product?.name.split(" ").map((word) => ({
//     name: {
//       contains: word,
//     },
//   }));
//   const relatedProducts = await client.product.findMany({
//     where: {
//       OR: terms,
//       AND: {
//         id: {
//           not: product?.id,
//         },
//       },
//     },
//   });
//   return {
//     props: {
//       product: JSON.parse(JSON.stringify(product)),
//       relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
//     },
//   };
// };

export default ItemDetail;
