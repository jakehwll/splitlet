import { withAuth } from "@workos-inc/authkit-nextjs";

export default async function Home() {
  const { user } = await withAuth();

  if (!user) {
    return <div>Not signed in :(</div>;
  }

  return <div>Foo</div>;
}
