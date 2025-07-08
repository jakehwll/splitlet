import { withAuth } from "@workos-inc/authkit-nextjs";
import cc from "classcat";

export default async function Home() {
  const { user } = await withAuth();

  if (!user) {
    return <div>Not signed in :(</div>;
  }

  return (
    <header className="flex items-center justify-between">
      <h1 className="font-serif text-2xl font-medium text-white">Dashboard</h1>
      <button
        type="button"
        className={cc([
          "relative bg-green-600 py-2.5 px-3.5 text-sm font-medium rounded-md font-semibold",
          "skeuemorphic text-white",
        ])}
      >
        New Expense
      </button>
    </header>
  );
}
