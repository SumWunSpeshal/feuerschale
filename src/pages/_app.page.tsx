// src/pages/_app.tsx
import { Raleway } from "@next/font/google";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppType } from "next/app";
import Head from "next/head";
import "src/styles/globals.css";
import { trpc } from "src/utils/trpc";

const ralewayFont = Raleway({ subsets: ["latin"] });

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
        <title>Feuerschale 🔥</title>
        <meta
          name="description"
          content="Deine App um Deine Slam-Auftritte zu verwalten."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <style jsx global>{`
        html {
          font-family: ${ralewayFont.style.fontFamily};
          --font-family: ${ralewayFont.style.fontFamily};
        }
      `}</style>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
