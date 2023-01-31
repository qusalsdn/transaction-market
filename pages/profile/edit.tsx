import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import useMutation from "@libs/client/useMutation";

interface EditProfileForm {
  avatar?: FileList;
  name?: string;
  email?: string;
  phone?: string;
  formErrors?: string;
}

interface EditProfileResponse {
  ok: boolean;
  error?: string;
}

const EditProfile: NextPage = () => {
  const { user } = useUser();
  const {
    register,
    setValue,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
  } = useForm<EditProfileForm>();
  const [editProfile, { data, loading }] =
    useMutation<EditProfileResponse>("/api/users/me");

  useEffect(() => {
    if (user?.name) setValue("name", user.name);
    if (user?.email) setValue("email", user.email);
    if (user?.phone) setValue("phone", user.phone);
  }, [user, setValue]);

  useEffect(() => {
    if (data && !data.ok && data.error) {
      setError("formErrors", { message: data.error });
    }
  }, [data, setError]);

  const onValid = async ({ avatar, name, email, phone }: EditProfileForm) => {
    if (loading) return;
    if (name === "" && email === "" && phone === "") {
      return setError("formErrors", {
        message: "이메일이나 전화번호 중 하나가 필요합니다. 하나를 선택하세요.",
      });
    }
    if (avatar && avatar.length > 0 && user) {
      const { id, uploadURL } = await (await fetch("/api/files")).json();
      const form = new FormData();
      form.append("file", avatar[0], user?.id.toString());
      await fetch(uploadURL, { method: "POST", body: form });
      return;
      editProfile({ name, email, phone, avatarURL: "" });
    } else {
      editProfile({ name, email, phone });
    }
  };

  const [avatarPreview, setAvatarPreview] = useState("");
  const avatar = watch("avatar"); // watch 함수로 변경을 감지
  useEffect(() => {
    if (avatar && avatar?.length > 0) {
      // 아래의 file은 브라우저의 메모리에 있는 파일이다. 그리고 나서 URL.createObjectURL()을 가지고 해당 파일에 접근할 수 있게 해달라는 것이다.
      const file = avatar[0];
      setAvatarPreview(URL.createObjectURL(file));
    }
  }, [avatar]);

  return (
    <Layout canGoBack title="내 정보 수정">
      <form onSubmit={handleSubmit(onValid)} className="space-y-4 py-10 px-4">
        <div className="flex items-center space-x-3">
          {avatarPreview ? (
            <img src={avatarPreview} className="h-14 w-14 rounded-full bg-slate-500" />
          ) : (
            <div className="h-14 w-14 rounded-full bg-slate-500" />
          )}
          <label
            htmlFor="picture"
            className="cursor-pointer rounded-md border border-gray-300 py-2 px-3 text-sm font-medium text-gray-700
             shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            변경
            <input
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
              {...register("avatar")}
            />
          </label>
        </div>

        <Input
          required={false}
          label="닉네임"
          name="name"
          type="text"
          register={register("name")}
        />
        <Input
          required={false}
          label="이메일 주소"
          name="email"
          type="email"
          register={register("email")}
        />
        <Input
          required={false}
          label="전화번호"
          name="phone"
          type="number"
          kind="phone"
          register={register("phone")}
        />
        {errors?.formErrors ? (
          <span className="my-2 block text-center font-bold text-orange-400">
            {errors?.formErrors?.message}
          </span>
        ) : null}
        <Button text={loading ? "로딩중..." : "업데이트"} />
      </form>
    </Layout>
  );
};

export default EditProfile;
