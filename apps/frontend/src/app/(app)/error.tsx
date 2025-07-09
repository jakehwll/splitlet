"use client";

const Error = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="flex flex-col items-start gap-6 w-full max-w-sm">
        <div className="text-2xl text-white font-serif">Something went wrong</div>
        <p>Please refresh the page. However, if the issues persists please contact us.</p>
      </div>
    </div>
  );
};

export default Error;
