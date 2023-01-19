import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const useUser = () => {
  const [user, setUser] = useState();
  const router = useRouter();
  useEffect(() => {
    fetch("/api/users/me")
      .then((response) => response.json())
      .then((data) => {
        if (!data.ok) {
          return router.replace("/enter"); // push 대신 replace를 사용하면 히스토리가 남지 않는다.
        }
        setUser(data.profile);
      });
  }, [router]);
  return user;
};

export default useUser;
