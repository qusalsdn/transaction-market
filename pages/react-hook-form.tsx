import React, { useState } from "react";

const React_Hook_form = () => {
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onUsernameChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setUsername(value);
  };

  const onEmailChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setEmail(value);
  };
  console.log(userName, email, password);

  const onPasswordChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setPassword(value);
  };

  const onSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(userName, email, password);
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Username"
        required
        value={userName}
        onChange={onUsernameChange}
        minLength={5}
      />
      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={onEmailChange}
      />
      <input
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={onPasswordChange}
      />
      <input type="submit" value="Create Account" />
    </form>
  );
};

export default React_Hook_form;
