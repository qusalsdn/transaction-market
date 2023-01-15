import { useForm } from "react-hook-form";

const React_Hook_form = () => {
  // register 함수는 input을 state와 연결시켜 주는 역할을 한다.
  const { register, watch } = useForm();
  console.log(watch());

  return (
    <form>
      <input type="text" placeholder="Username" required {...register("userName")} />
      <input type="email" placeholder="Email" required {...register("email")} />
      <input type="password" placeholder="Password" required {...register("passWord")} />
      <input type="submit" value="Create Account" />
    </form>
  );
};

export default React_Hook_form;
