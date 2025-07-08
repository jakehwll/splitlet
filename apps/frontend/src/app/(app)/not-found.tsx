"use client";

const Error = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="flex flex-col items-start gap-6 w-full max-w-sm">
        <div className="text-4xl text-white font-serif">Page not found</div>
        <p>Sorry, the page you are looking for doesn't exist or has been moved.</p>
      </div>
    </div>
  );
};

export default Error;
