import { LoaderCircle } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex-1 flex justify-center items-center">
      <LoaderCircle className="animate-spin text-green-500" />
    </div>
  );
};

export default Loading;
