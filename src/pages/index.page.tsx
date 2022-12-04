import { City } from "@prisma/client";
import type { NextPage } from "next";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import TestImg from "public/img/test.jpg";
import { useState } from "react";
import Container from "src/components/Container";
import { Layout } from "src/components/Layout";
import Search from "src/components/Search";
import Tile from "src/components/Tile";
import { trpc } from "src/utils/trpc";

const Home: NextPage = () => {
  const { data: sessionData } = trpc.auth.getSession.useQuery();
  const {
    data: cityData,
    mutate,
    reset,
  } = trpc.city.searchCities.useMutation();
  const [city, setCity] = useState<City | undefined>(undefined);

  return (
    <Layout>
      <main>
        <Container>
          <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
            Hallo{" "}
            <span className="text-purple-300">{sessionData?.user?.name}</span>
          </h1>

          <div className="grid grid-cols-3 gap-4">
            <Tile title="Meine Auftritte" src={TestImg} imgAlt="todo"></Tile>
            <Tile title="Meine Texte" src={TestImg} imgAlt="todo"></Tile>
            <Tile title="Meine Venues" src={TestImg} imgAlt="todo"></Tile>
          </div>
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
        </Container>
      </main>
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
