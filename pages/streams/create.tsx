import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Stream } from "@prisma/client";

interface CreateFrom {
  name: string;
  price: string;
  description: string;
}

interface CreateResponse {
  ok: boolean;
  stream: Stream;
}

const Create: NextPage = () => {
  const [createStream, { data, loading }] = useMutation<CreateResponse>("/api/streams");
  const { register, handleSubmit } = useForm<CreateFrom>();
  const router = useRouter();

  useEffect(() => {
    if (data && data.ok) {
      router.push(`/stream/${data.stream.id}`);
    }
  }, [data, router]);

  const onValid = (data: CreateFrom) => {
    if (loading) return;
    createStream(data);
  };

  return (
    <Layout canGoBack title="Go Live">
      <form onSubmit={handleSubmit(onValid)} className=" space-y-4 py-10 px-4">
        <Input
          required
          label="Name"
          name="name"
          type="text"
          register={register("name", { required: true })}
        />
        <Input
          required
          label="Price"
          name="price"
          type="text"
          kind="price"
          register={register("price", { required: true })}
        />
        <TextArea
          name="description"
          label="설명"
          register={register("description", { required: true })}
        />
        <Button text={loading ? "로딩중..." : "라이브 시작"} />
      </form>
    </Layout>
  );
};

export default Create;
