import { useEffect } from "react";
import { authClient } from "../../utils/auth";
import { useNavigate } from "react-router";

const SignOut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    authClient.signOut(
      {},
      {
        onSuccess() {
          navigate("/auth/sign-in");
        },
      }
    );
  }, []);

  return <div />;
};

export default SignOut;
