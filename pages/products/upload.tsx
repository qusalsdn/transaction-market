import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect, useState } from "react";
import { Product } from "@prisma/client";
import { useRouter } from "next/router";
import Image from "next/image";

interface UploadProductForm {
  name: string;
  price: number;
  description: string;
  photo: FileList;
}

interface UploadProductMutation {
  ok: boolean;
  // prisma는 자동으로 타입을 만들어주기 때문에 모든 타입들을 다시 재정의 할 필요가 없다.
  product: Product;
}

const Upload: NextPage = () => {
  const { register, handleSubmit, watch } = useForm<UploadProductForm>();
  const [uploadProduct, { loading, data }] =
    useMutation<UploadProductMutation>("/api/products");
  const router = useRouter();

  const onValid = async ({ name, price, description, photo }: UploadProductForm) => {
    if (loading) return;
    if (photo && photo.length > 0) {
      const { id, uploadURL } = await (await fetch("/api/files")).json();
      const form = new FormData();
      form.append("file", photo[0], name);
      await fetch(uploadURL, { method: "POST", body: form });
      uploadProduct({ name, price, description, photoId: id });
    } else {
      uploadProduct({ name, price, description });
    }
  };

  useEffect(() => {
    if (data?.ok) {
      router.push(`/products/${data.product.id}`);
    }
  }, [data, router]);

  const [photoPreview, setPhotoPreview] = useState("");
  const photo = watch("photo");
  useEffect(() => {
    if (photo && photo.length > 0) {
      const file = photo[0];
      setPhotoPreview(URL.createObjectURL(file));
    }
  }, [photo]);

  return (
    <Layout canGoBack title="내 물건 팔기">
      <form className="space-y-4 p-4" onSubmit={handleSubmit(onValid)}>
        <div>
          <label
            className="flex h-48 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed
           border-gray-300 text-gray-600 transition-colors hover:border-orange-500 hover:text-orange-500"
          >
            <svg
              className="h-12 w-12"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              className="hidden"
              type="file"
              accept="image/*"
              {...register("photo")}
            />
          </label>
          {photoPreview && (
            <div className="relative pb-80">
              <Image
                src={photoPreview}
                alt="product"
                className="mt-3 rounded-md bg-slate-300 object-contain"
                fill
              />
            </div>
          )}
        </div>

        <Input
          required
          label="상품명"
          name="name"
          type="text"
          register={register("name", { required: true })}
        />
        <Input
          required
          label="금액"
          name="price"
          type="text"
          kind="price"
          register={register("price", { required: true })}
        />
        <TextArea
          required
          name="description"
          label="설명"
          register={register("description", { required: true })}
        />
        <Button text={loading ? "로딩중..." : "완료"} />
      </form>
    </Layout>
  );
};

export default Upload;
