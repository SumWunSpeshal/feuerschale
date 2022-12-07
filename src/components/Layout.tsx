import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import { trpc } from "src/utils/trpc";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Main } from "./Main";

type LayoutProps = PropsWithChildren<{
  authGuarded?: boolean;
}>;

export function Layout({ children, authGuarded = false }: LayoutProps) {
  const { data: sessionData } = trpc.auth.getSession.useQuery();
  const router = useRouter();

  if (authGuarded && !sessionData) {
    if (typeof window === "object") {
      router.push("/auth/signin");
    }
  }

  return authGuarded && !sessionData ? (
    <>unauthorized</>
  ) : (
    <div className="h-full border-2 border-black font-semibold">
      <Header />
      <Main>{children}</Main>
      <Footer />
    </div>
  );
}
