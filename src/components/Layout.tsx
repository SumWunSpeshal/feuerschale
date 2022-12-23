import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import { trpc } from "src/utils/trpc";
import { FloatingNav } from "./FloatingNav";
import { Global } from "./Global";
import { Loader, LoaderProps } from "./Loader";
import { Main } from "./Main";

type LayoutProps = PropsWithChildren<{
  authGuarded?: boolean;
  noFloatingNav?: boolean;
  hrefToListView?: string;
  loadings?: LoaderProps["loadings"];
}>;

export function Layout({
  children,
  authGuarded = false,
  noFloatingNav,
  hrefToListView,
  loadings,
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
      {/* <Footer /> */}
      {!noFloatingNav && <FloatingNav hrefToListView={hrefToListView} />}
      <Loader loadings={loadings} />
    </Global>
  );
}
