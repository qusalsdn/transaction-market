import type { NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { cls } from "@libs/client/utils";

interface WriteForm {
  review: string;
}

interface WriteReviewResponse {
  ok: boolean;
}

const Write: NextPage = () => {
  const router = useRouter();
  const {
    query: { productId, sellerId, buyerId },
  } = router;
  const { register, handleSubmit } = useForm<WriteForm>();
  const [writeReview, { data: responseReview, loading: reviewLoading }] =
    useMutation<WriteReviewResponse>(
      `/api/users/writeReview?productId=${productId}&sellerId=${sellerId}&buyerId=${buyerId}`
    );
  const [drawStar, setDrawStar] = useState(0);
  const [selectStar, setSelectStar] = useState(0);

  const onValid = (review: WriteForm) => {
    if (reviewLoading) return;
    const result = window.confirm(
      "리뷰를 제출하면 수정 및 삭제를 할 수 없습니다. 제출하시겠습니까?"
    );
    if (selectStar === 0) return;
    if (result) writeReview({ review, selectStar });
  };

  useEffect(() => {
    if (responseReview?.ok) router.push(`/profile/${sellerId}`);
    else if (responseReview?.ok === false)
      window.alert("해당 제품에 대한 리뷰는 이미 작성되었습니다.");
  }, [responseReview, router, sellerId]);

  return (
    <Layout canGoBack title="리뷰작성" seoTitle="리뷰작성">
      <form onSubmit={handleSubmit(onValid)} className="space-y-4 p-4">
        <TextArea
          required
          placeholder="리뷰를 입력하세요."
          register={register("review", { required: true, minLength: 5 })}
        />
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onMouseEnter={() => setDrawStar(star)}
            onMouseLeave={() => {
              selectStar !== 0 ? setDrawStar(selectStar) : setDrawStar(0);
            }}
            onClick={() => {
              setDrawStar(star);
              setSelectStar(star);
            }}
          >
            <svg
              className={cls(
                "h-5 w-5",
                drawStar >= star ? "text-orange-400" : "text-slate-300"
              )}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
        <Button text={reviewLoading ? "로딩중..." : "완료"} />
      </form>
    </Layout>
  );
};

export default Write;
