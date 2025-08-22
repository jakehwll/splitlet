import { Outlet } from "react-router";
import { Toaster } from "sonner";

const AuthLayout = () => {
  return (
    <div className="p-6 flex flex-col justify-center items-center min-h-screen">
      <Toaster />
      <Outlet />
    </div>
  );
};

export default AuthLayout;
