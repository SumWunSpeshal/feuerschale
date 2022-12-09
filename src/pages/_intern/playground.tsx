import { City } from "@prisma/client";
import type { NextPage } from "next";
import { signIn, signOut } from "next-auth/react";
import NextImage from "next/image";
import Link from "next/link";
import LogoSvg from "public/img/logo.svg";
import ShowImg from "public/img/show.jpg";
import TextImg from "public/img/text.jpg";
import VenueImg from "public/img/venue.jpg";
import { useState } from "react";
import { Container } from "src/components/Container";
import { Layout } from "src/components/Layout";
import { Search } from "src/components/Search";
import { Section } from "src/components/Section";
import { Tile } from "src/components/Tile";
import { trpc } from "src/utils/trpc";

const Home: NextPage = () => {
  const { data: cityData, mutate, reset } = trpc.city.search.useMutation();
  const [city, setCity] = useState<City | undefined>(undefined);

  return (
    <Layout authGuarded noFloatingNav>
      <Section>
        <Container>
          <div className="mx-auto max-w-2xl py-14">
            <div
              className="relative mb-8 grid grid-cols-4"
              style={{
                "--gap-y": "4rem",
                "--gap-x": "12rem",
                rowGap: "var(--gap-y)",
                columnGap: "var(--gap-x)",
              }}
            >
              <div className="absolute inset-0">
                <div
                  className="absolute inset-0 scale-[1.13] bg-black"
                  style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
                ></div>
                <div
                  className="absolute inset-0 scale-110 bg-amber-200"
                  style={{
                    clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                    transform: "translateY(2px) scale(1.1)",
                  }}
                ></div>
                <NextImage
                  src={LogoSvg}
                  alt="Feuerschale Logo"
                  priority
                  width={128}
                  height={128}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 opacity-20"
                />
              </div>
              <div className="relative col-span-2 col-start-2">
                <Tile
                  title="Meine Auftritte"
                  src={ShowImg}
                  imgAlt="Meine Auftritte"
                  href="/shows"
                />
              </div>
              <div className="relative col-span-2">
                <Tile
                  title="Meine Texte"
                  src={TextImg}
                  imgAlt="Meine Texte"
                  href="/texts"
                />
              </div>
              <div className="relative col-span-2">
                <Tile
                  title="Meine Venues"
                  src={VenueImg}
                  imgAlt="Meine Venues"
                  href="/venues"
                />
              </div>
            </div>
          </div>
          <div className="hidden">
            <Search
              data={cityData}
              onChange={({ target }) => mutate({ value: target.value })}
              onSelection={(e) => {
                reset();
                setCity(e);
              }}
              suggestion={(city) => city?.Stadt}
              id="city-search"
              afterSelectionMode="clear"
            />
          </div>
        </Container>
      </Section>
    </Layout>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery();
  const { data: sessionData } = trpc.auth.getSession.useQuery();

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <p className="text-2xl text-blue-500">
        Logged in as {sessionData?.user?.name}
      </p>
      {secretMessage && (
        <p className="text-2xl text-blue-500">{secretMessage}</p>
      )}
      <button
        className="rounded-md border border-black bg-violet-50 px-4 py-2 text-xl shadow-lg hover:bg-violet-100"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>

      <Link href="/auth/signin">Sign in Page</Link>
    </div>
  );
};
