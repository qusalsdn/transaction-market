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
import useSWR from "swr";

interface CreateFrom {
  name: string;
  price: string;
  description: string;
}

interface StreamsResponse {
  ok: boolean;
  stream: Stream;
}

interface UpdateStreamResponse {
  ok: boolean;
}

const UpdateStream: NextPage = () => {
  const router = useRouter();
  const { data } = useSWR<StreamsResponse>(`/api/streams/${router.query.id}`);
  const { register, handleSubmit } = useForm<CreateFrom>();
  const [updateStream, { data: updateStreamData, loading: updateStreamLoading }] =
    useMutation<UpdateStreamResponse>(`/api/streams/${router.query.id}/update`);

  useEffect(() => {
    if (updateStreamData?.ok) router.back();
  }, [updateStreamData, router]);

  const onValid = (data: CreateFrom) => {
    if (updateStreamLoading) return;
    updateStream({ data }, "PUT");
  };

  return (
    <Layout canGoBack title="Go Live" seoTitle="라이브 스트림 시작">
      <form onSubmit={handleSubmit(onValid)} className=" space-y-4 py-10 px-4">
        <Input
          required
          label="Name"
          name="name"
          type="text"
          register={register("name", { required: true })}
          beforeName={data?.stream.name}
        />
        <Input
          required
          label="Price"
          name="price"
          type="text"
          kind="price"
          register={register("price", {
            required: true,
          })}
          beforePrice={data?.stream.price.toString()}
        />
        <TextArea
          name="description"
          label="설명"
          register={register("description", { required: true })}
          beforeValue={data?.stream.description}
        />
        <Button text={updateStreamLoading ? "로딩중..." : "완료"} />
      </form>
    </Layout>
  );
};

export default UpdateStream;
