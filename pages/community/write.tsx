import type { NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { Post } from "@prisma/client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import useCoords from "@libs/client/useCoords";

interface WriteForm {
  title: string;
  question: string;
}

interface WriteResponse {
  ok: boolean;
  post: Post;
}

const Write: NextPage = () => {
  const { register, handleSubmit } = useForm<WriteForm>();
  const [post, { data, loading }] = useMutation<WriteResponse>("/api/posts");
  const router = useRouter();
  const { latitude, longitude } = useCoords();

  const onValid = (data: WriteForm) => {
    // loading이 있을 경우 return을 하는 이유는 유저가 여러번 클릭하는 것을 방지하기 위해서이다.
    if (loading) return;
    post({ ...data, latitude, longitude });
  };

  useEffect(() => {
    if (data && data.ok) {
      router.push(`/community/${data.post.id}`);
    }
  }, [data, router]);

  return (
    <Layout canGoBack title="동네생활 글쓰기" seoTitle="커뮤니티 글쓰기">
      <form onSubmit={handleSubmit(onValid)} className="space-y-4 p-4">
        <TextArea
          required
          placeholder="제목을 입력하세요."
          register={register("title", { required: true, minLength: 5, maxLength: 20 })}
        />
        <TextArea
          required
          placeholder="질문을 입력하세요."
          register={register("question", { required: true, minLength: 5 })}
        />
        <Button text={loading ? "로딩중..." : "완료"} />
      </form>
    </Layout>
  );
};

export default Write;
