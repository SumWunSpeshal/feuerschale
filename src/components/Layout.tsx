import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import { trpc } from "src/utils/trpc";
import { FloatingNav } from "./FloatingNav";
import { Footer } from "./Footer";
import { Global } from "./Global";
import { Main } from "./Main";

type LayoutProps = PropsWithChildren<{
  authGuarded?: boolean;
  noFloatingNav?: boolean;
}>;

export function Layout({
  children,
  authGuarded = false,
  noFloatingNav,
}: LayoutProps) {
  const { data: sessionData } = trpc.auth.getSession.useQuery();
  const router = useRouter();

  if (authGuarded && !sessionData) {
    if (typeof window === "object") {
      router.push("/auth/signin");
    }

    return null;
  }

  return (
    <Global>
      {/* <Header /> */}
      <Main>{children}</Main>
      <Footer />
      {!noFloatingNav && <FloatingNav />}
    </Global>
  );
}
