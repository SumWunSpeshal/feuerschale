import { City } from "@prisma/client";
import type { NextPage } from "next";
import { signOut } from "next-auth/react";
import NextImage from "next/image";
import { useState } from "react";
import { Anchor } from "src/components/Anchor";
import { Button } from "src/components/Button";
import { Container } from "src/components/Container";
import { DashboardTile } from "src/components/DashboardTile";
import { Highlight } from "src/components/Highlight";
import { Layout } from "src/components/Layout";
import { PreviewList } from "src/components/PreviewList";
import { Section } from "src/components/Section";
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
        </Container>
      </Section>
    </Layout>
  );
};

export default Home;
