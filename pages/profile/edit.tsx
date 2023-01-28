import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

interface EditProfileForm {
  email?: string;
  phone?: string;
  formErrors?: string;
}

const EditProfile: NextPage = () => {
  const { user } = useUser();
  const {
    register,
    setValue,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<EditProfileForm>();

  useEffect(() => {
    if (user?.email) setValue("email", user?.email);
    if (user?.phone) setValue("phone", user.phone);
  }, [user, setValue]);

  const onValid = ({ email, phone }: EditProfileForm) => {
    if (email === "" && phone === "") {
      setError("formErrors", {
        message: "이메일이나 전화번호 중 하나가 필요합니다. 하나를 선택하세요.",
      });
    }
  };

  return (
    <Layout canGoBack title="내 정보 수정">
      <form onSubmit={handleSubmit(onValid)} className="space-y-4 py-10 px-4">
        <div className="flex items-center space-x-3">
          <div className="h-14 w-14 rounded-full bg-slate-500" />
          <label
            htmlFor="picture"
            className="cursor-pointer rounded-md border border-gray-300 py-2 px-3 text-sm font-medium text-gray-700
             shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            변경
            <input id="picture" type="file" className="hidden" accept="image/*" />
          </label>
        </div>

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
        <Button text="업데이트" />
      </form>
    </Layout>
  );
};

export default EditProfile;
