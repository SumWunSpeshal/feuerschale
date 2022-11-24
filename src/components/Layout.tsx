import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import { trpc } from "src/utils/trpc";

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
    <>
      <header>Header</header>
      {children}
      <footer>Footer</footer>
    </>
  );
}
