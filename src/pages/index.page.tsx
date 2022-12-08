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
import { Anchor } from "src/components/Anchor";
import { Button } from "src/components/Button";
import { Container } from "src/components/Container";
import { DashboardTile } from "src/components/DashboardTile";
import { Highlight } from "src/components/Highlight";
import { Layout } from "src/components/Layout";
import { PreviewList } from "src/components/PreviewList";
import { Search } from "src/components/Search";
import { Section } from "src/components/Section";
import { Tile } from "src/components/Tile";
import { formatDate } from "src/utils/format-date";
import { trpc } from "src/utils/trpc";

const Home: NextPage = () => {
  const { data: sessionData } = trpc.auth.getSession.useQuery();
  const { data: cityData, mutate, reset } = trpc.city.search.useMutation();
  const { data: dashboardData } = trpc.dashboard.get.useQuery();
  const [city, setCity] = useState<City | undefined>(undefined);

  return (
    <Layout authGuarded noFloatingNav>
      <Section>
        <Container>
          <div className="mb-16">
            <h1 className="text-5xl font-extrabold md:text-[5rem]">
              Hallo <Highlight>{sessionData?.user?.name}</Highlight>
            </h1>
          </div>

          <div className="grid auto-rows-fr grid-cols-3 gap-8">
            <div>
              <DashboardTile title="Profil" titleClassName="bg-teal-500">
                {sessionData?.user?.image && (
                  <div className="mb-4">
                    <div className="inline-flex overflow-hidden rounded-full border-2 border-black shadow-brutal">
                      <NextImage
                        src={sessionData.user.image}
                        height={64}
                        width={64}
                        alt={`Profilbild ${sessionData?.user?.name}`}
                      />
                    </div>
                  </div>
                )}
                <div className="mb-4">
                  <span className="text-xl">{sessionData?.user?.name}</span>
                  {sessionData?.user?.email && (
                    <div>
                      <span className="text-gray-600">
                        {sessionData?.user?.email}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <Button onClick={() => signOut()} className="bg-red-400">
                    Abmelden
                  </Button>
                </div>
              </DashboardTile>
            </div>
            <div>
              <DashboardTile
                title={<Anchor href="/shows">Auftritte</Anchor>}
                titleClassName="bg-amber-500"
              >
                <PreviewList>
                  {dashboardData?.VenueText.map(
                    ({ created_at, id, Text, Venue }) => {
                      return (
                        <PreviewList.Item
                          key={id}
                          title={formatDate["dd.MM.yyyy"](created_at)}
                          href={`/shows/${id}`}
                          description={
                            <>
                              {Text.name} / {Venue.name}
                            </>
                          }
                        />
                      );
                    }
                  )}
                </PreviewList>
              </DashboardTile>
            </div>
            <div>
              <DashboardTile
                title={<Anchor href="/venues">Venues</Anchor>}
                titleClassName="bg-sky-500"
              >
                <PreviewList>
                  {dashboardData?.Venue.map(({ id, name, City }) => (
                    <PreviewList.Item
                      key={id}
                      href={`/venues/${id}`}
                      title={name}
                      description={City.Stadt}
                    />
                  ))}
                </PreviewList>
              </DashboardTile>
            </div>

            <div className="col-span-2">
              <DashboardTile title="Rechnungen" titleClassName="bg-fuchsia-500">
                <PreviewList>
                  {dashboardData?.Invoice.map(
                    ({ id, VenueText, venueTextId }) => (
                      <PreviewList.Item
                        key={id}
                        title={`${venueTextId}.pdf`}
                        description={
                          <>
                            {formatDate["dd.MM.yyyy"](VenueText.created_at)} /{" "}
                            {VenueText.Venue.name} / {VenueText.Text.name}
                          </>
                        }
                      />
                    )
                  )}
                </PreviewList>
              </DashboardTile>
            </div>
            <div>
              <DashboardTile
                title={<Anchor href="/texts">Texte</Anchor>}
                titleClassName="bg-indigo-400"
              >
                <PreviewList>
                  {dashboardData?.texts.map(({ id, name }) => (
                    <PreviewList.Item
                      key={id}
                      title={name}
                      href={`/texts/${id}`}
                    />
                  ))}
                </PreviewList>
              </DashboardTile>
            </div>
          </div>

          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
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
