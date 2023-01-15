import { useForm } from "react-hook-form";
import { FieldErrors } from "react-hook-form/dist/types";

interface LoginForm {
  userName: string;
  email: string;
  passWord: string;
}

const React_Hook_form = () => {
  // register 함수는 input을 state와 연결시켜 주는 역할을 한다.
  const { register, watch, handleSubmit } = useForm<LoginForm>();

  const onValid = (data: LoginForm) => {
    console.log("valid!");
  };

  const onInValid = (errors: FieldErrors) => {
    console.log(errors);
  };

  console.log(watch());

  return (
    // handleSubmit 함수에는 2가지 인자를 갖는데 1번째 인자는 form이 유효할 때 실행할 함수이고 2번째 인자는 form이 유효하지 않을 때 실행할 함수이다.
    // register의 2번째 인자부터는 내가 정해줄 규칙들을 정의한다.
    <form onSubmit={handleSubmit(onValid, onInValid)}>
      <input
        type="text"
        placeholder="Username"
        {...register("userName", {
          required: "Username is required",
          minLength: { message: "5글자 이상이어야 합니다.", value: 5 },
        })}
      />
      <input
        type="email"
        placeholder="Email"
        {...register("email", { required: "Email is required" })}
      />
      <input
        type="password"
        placeholder="Password"
        {...register("passWord", { required: "Pawwrod is required" })}
      />
      <input type="submit" value="Create Account" />
    </form>
  );
};

export default React_Hook_form;
