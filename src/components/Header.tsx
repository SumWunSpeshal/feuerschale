import { signOut } from "next-auth/react";
import Link from "next/link";
import { trpc } from "src/utils/trpc";
import { Logo } from "./Logo";

type HeaderProps = {
  // sessionData: Session | null | undefined;
};

export function Header(props: HeaderProps) {
  const { data: sessionData } = trpc.auth.getSession.useQuery();

  return (
    <div className="flex items-center justify-between border-b-2 border-gray-300 py-3 px-6">
      <Logo />
      <div>
        {sessionData ? (
          <button
            className="rounded-md border border-black bg-violet-50 px-4 py-2 text-xl shadow-lg hover:bg-violet-100"
            onClick={() => signOut()}
          >
            Sign out
          </button>
        ) : (
          <Link href="/auth/signin">Sign in Page</Link>
        )}
      </div>
    </div>
  );
}
