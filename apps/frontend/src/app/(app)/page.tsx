import cc from "classcat";
import Link from "next/link";

export default async function Home() {
  return (
    <>
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-serif text-2xl font-medium text-white">Hello, {"firstName"}!</h1>
          <p>We hope you're having a lovely day!</p>
        </div>
        <div className="flex gap-4">
          <Link
            href={"/expense"}
            className={cc([
              "relative bg-gray-950 py-2.5 px-3.5 text-sm font-medium rounded-md font-semibold",
              "skeuemorphic-alt text-white",
            ])}
          >
            Add an Expense
          </Link>
          <Link
            href={"/settle"}
            className={cc([
              "relative bg-green-600 py-2.5 px-3.5 text-sm font-medium rounded-md font-semibold",
              "skeuemorphic text-white",
            ])}
          >
            Settle Up
          </Link>
        </div>
      </header>
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="shadow p-6 border border-gray-800 rounded-lg flex flex-col gap-2">
          <p className="font-medium text-sm text-white">Total balance..</p>
          <p className="text-3xl font-semibold text-red-500">-$2,580.75</p>
        </div>
        <div className="shadow p-6 border border-gray-800 rounded-lg flex flex-col gap-2">
          <p className="font-medium text-sm text-white">You owe..</p>
          <p className="text-3xl font-semibold text-red-500">$2,704.55</p>
        </div>
        <div className="shadow p-6 border border-gray-800 rounded-lg flex flex-col gap-2">
          <p className="font-medium text-sm text-white">You are owed..</p>
          <p className="text-3xl font-semibold text-green-500">$123.80</p>
        </div>
      </section>
    </>
  );
}
