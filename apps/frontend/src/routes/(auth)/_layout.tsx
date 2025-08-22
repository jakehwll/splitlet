import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="p-6 flex flex-col justify-center items-center min-h-screen">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
