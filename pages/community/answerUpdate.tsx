import type { NextPage } from "next";
import TextArea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useRouter } from "next/router";
import Layout from "@components/layout";
import { useEffect } from "react";

interface AnswerUpdateResponse {
  ok: boolean;
}

interface AnswerForm {
  answer: string;
}

const CommunityAnswerUpdate: NextPage = () => {
  const router = useRouter();
  const {
    query: { postId, answerId, answer },
  } = router;
  const { register, handleSubmit } = useForm<AnswerForm>();
  const [updateAnswer, { data, loading }] = useMutation<AnswerUpdateResponse>(
    `/api/posts/${answerId}/answers`
  );

  useEffect(() => {
    if (data?.ok) router.back();
  }, [data, router, postId]);

  const onValid = (data: AnswerForm) => {
    console.log(data.answer);
    updateAnswer(data.answer, "PUT");
  };

  return (
    <Layout canGoBack seoTitle="답변 수정">
      <div>
        <form className="px-4" onSubmit={handleSubmit(onValid)}>
          <TextArea
            name="description"
            placeholder="수정할 답변을 입력하세요."
            required
            register={register("answer", { required: true, minLength: 5 })}
            beforeValue={answer}
          />
          <button className="mt-2 w-full rounded-md border border-transparent bg-orange-400 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ">
            {loading ? "로딩중..." : "답변"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CommunityAnswerUpdate;
