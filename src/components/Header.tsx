import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { trpc } from "src/utils/trpc";
import { Fab } from "./Fab";
import { Logo } from "./Logo";

type HeaderProps = {
  // sessionData: Session | null | undefined;
};

export function Header(props: HeaderProps) {
  const { data: sessionData } = trpc.auth.getSession.useQuery();

  return (
    <div className="flex items-center justify-between border-b-2 border-black py-3 px-6">
      <Logo />
      <div>
        {sessionData ? (
          <Fab icon={faArrowRightFromBracket} onClick={() => signOut()} />
        ) : (
          <Link href="/auth/signin">Sign in Page</Link>
        )}
      </div>
    </div>
  );
}
