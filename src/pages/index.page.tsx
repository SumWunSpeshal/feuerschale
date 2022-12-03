import type { NextPage } from "next";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { DebounceInput } from "react-debounce-input";
import { Layout } from "src/components/Layout";
import { trpc } from "src/utils/trpc";

const Home: NextPage = () => {
  const { data: cityData, mutate } = trpc.city.searchCities.useMutation();

  return (
    <Layout>
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
          Create <span className="text-purple-300">T3</span> App
        </h1>
        <p className="text-2xl text-gray-700">This stack uses:</p>
        <AuthShowcase />
        <DebounceInput
          minLength={3}
          debounceTimeout={500}
          style={{ border: "1px solid blue" }}
          onChange={({ target }) => mutate({ value: target.value })}
          id="city-search"
          name="city-search"
          list="city-suggestions"
        />
        <datalist id="city-suggestions">
          {cityData?.map(({ Stadt }) => (
            <option value={Stadt} key={Stadt} />
          ))}
        </datalist>
        <pre style={{ width: "100%", display: "none" }}>
          {cityData?.length ? JSON.stringify(cityData, undefined, 2) : "empty"}
        </pre>
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
