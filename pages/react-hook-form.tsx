import { useForm } from "react-hook-form";
import { FieldErrors } from "react-hook-form/dist/types";

interface LoginForm {
  userName: string;
  email: string;
  passWord: string;
  errors?: string;
}

const React_Hook_form = () => {
  // register 함수는 input을 state와 연결시켜 주는 역할을 한다.
  const {
    register,
    watch,
    handleSubmit,
    setError,
    reset,
    resetField,
    formState: { errors },
  } = useForm<LoginForm>({ mode: "onChange" }); // 기본값은 onsubmit으로 설정되어 있다.

  const onValid = (data: LoginForm) => {
    console.log("valid!");
    // setError("userName", { message: "이미 존재하는 유저이름입니다." });
    // reset();
    resetField("passWord");
  };

  const onInValid = (errors: FieldErrors) => {
    console.log(errors);
  };

  console.log(errors);
  console.log(watch("email"));

  return (
    // handleSubmit 함수에는 2가지 인자를 갖는데 1번째 인자는 form이 유효할 때 실행할 함수이고 2번째 인자는 form이 유효하지 않을 때 실행할 함수이다.
    // register의 2번째 인자부터는 내가 정해줄 규칙들을 정의한다.
    <form onSubmit={handleSubmit(onValid, onInValid)}>
      <input
        type="text"
        placeholder="Username"
        {...register("userName", {
          required: "유저 이름은 필수 입력사항합니다.",
          minLength: { message: "5글자 이상이어야 합니다.", value: 5 },
        })}
      />
      {errors.userName?.message}
      <input
        type="email"
        placeholder="Email"
        {...register("email", {
          required: "이메일은 필수 입력사항합니다.",
          // 사용자가 직접 정의한 규칙은 아래와 같이 정의해서 사용할 수 있다.
          validate: {
            notGmail: (value) =>
              !value.includes("@gmail.com") || "지메일은 사용할 수 없습니다.",
          },
        })}
      />
      {errors.email?.message}
      <input
        type="password"
        placeholder="Password"
        {...register("passWord", { required: "비밀번호는 필수 입력사항합니다." })}
      />
      <input type="submit" value="Create Account" />
      {errors.errors?.message}
    </form>
  );
};

export default React_Hook_form;
