import { useForm } from "react-hook-form";

const React_Hook_form = () => {
  // register 함수는 input을 state와 연결시켜 주는 역할을 한다.
  const { register, watch, handleSubmit } = useForm();

  const onValid = () => {
    console.log("valid!");
  };

  console.log(watch());

  return (
    // handleSubmit 함수에는 2가지 인자를 갖는데 1번째 인자는 form이 성공적으로 제출되었을 때의 함수이고 2번째 인자는 form이 성공적으로 제출되지 않을 때의 함수이다.
    // register의 2번째 인자부터는 내가 정해줄 규칙들을 정의한다.
    <form onSubmit={handleSubmit(onValid)}>
      <input
        type="text"
        placeholder="Username"
        {...register("userName", { required: true })}
      />
      <input
        type="email"
        placeholder="Email"
        {...register("email", { required: true })}
      />
      <input
        type="password"
        placeholder="Password"
        {...register("passWord", { required: true })}
      />
      <input type="submit" value="Create Account" />
    </form>
  );
};

export default React_Hook_form;
