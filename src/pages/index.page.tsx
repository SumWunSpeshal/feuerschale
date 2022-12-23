import type { NextPage } from "next";
import { signOut } from "next-auth/react";
import NextImage from "next/image";
import { Anchor } from "src/components/Anchor";
import { Button } from "src/components/Button";
import { Chip } from "src/components/Chip";
import { Container } from "src/components/Container";
import { DashboardTile } from "src/components/DashboardTile";
import { Ellipsis } from "src/components/Ellipsis";
import { Highlight } from "src/components/Highlight";
import { Layout } from "src/components/Layout";
import { PreviewList } from "src/components/PreviewList";
import { Section } from "src/components/Section";
import { formatDate } from "src/utils/format-date";
import { trpc } from "src/utils/trpc";

const Home: NextPage = () => {
  const { data: sessionData } = trpc.auth.getSession.useQuery();
  const { data: dashboardData } = trpc.dashboard.get.useQuery();

  return (
    <Layout authGuarded noFloatingNav>
      <Section className="h-full">
        <Container>
          <div className="mb-12 sm:mb-16">
            <h1 className="text-5xl font-extrabold md:text-[5rem]">
              Hallo <Highlight>{sessionData?.user?.name}</Highlight>
            </h1>
          </div>

          <div className="grid grid-cols-1 gap-8 md:auto-rows-fr md:grid-cols-3">
            <div>
              <DashboardTile title="Profil" titleClassName="bg-teal-500">
                <div className="mb-6 flex flex-wrap items-center gap-4">
                  {sessionData?.user?.image && (
                    <div className="inline-flex overflow-hidden rounded-full border-2 border-black shadow-brutal">
                      <NextImage
                        src={sessionData.user.image}
                        height={64}
                        width={64}
                        alt={`Profilbild ${sessionData?.user?.name}`}
                      />
                    </div>
                  )}
                  <div className="max-w-full">
                    <Ellipsis>
                      <span className="text-xl">{sessionData?.user?.name}</span>
                    </Ellipsis>
                    {sessionData?.user?.email && (
                      <Ellipsis>
                        <span className="text-gray-600">
                          {sessionData?.user?.email}
                        </span>
                      </Ellipsis>
                    )}
                  </div>
                </div>
                <div className="mt-auto">
                  <Button onClick={() => signOut()} className="bg-red-400">
                    Abmelden
                  </Button>
                </div>
              </DashboardTile>
            </div>

            <div>
              <DashboardTile
                title={<Anchor href="/texts">Texte</Anchor>}
                titleClassName="bg-indigo-400"
              >
                {dashboardData?.texts.length ? (
                  <PreviewList>
                    {dashboardData.texts.map(({ id, name }) => (
                      <PreviewList.Item
                        key={id}
                        title={name}
                        href={`/texts/${id}`}
                      />
                    ))}
                  </PreviewList>
                ) : (
                  <div className="text-sm text-gray-600">
                    Du besitzt noch keine Slamtexte ☹️{" "}
                    <Anchor href="/texts">Erstelle</Anchor> Deinen ersten
                    Slamtext! ✨
                  </div>
                )}
              </DashboardTile>
            </div>

            <div>
              <DashboardTile
                title={<Anchor href="/venues">Venues</Anchor>}
                titleClassName="bg-sky-500"
              >
                {dashboardData?.Venue?.length ? (
                  <PreviewList>
                    {dashboardData.Venue.map(({ id, name, City }) => (
                      <PreviewList.Item
                        key={id}
                        href={`/venues/${id}`}
                        title={name}
                        description={City.Stadt}
                      />
                    ))}
                  </PreviewList>
                ) : (
                  <div className="text-sm text-gray-600">
                    Du besitzt noch keine Venues ☹️{" "}
                    <Anchor href="/venues">Erstelle</Anchor> Deine erste Venue!
                    ✨
                  </div>
                )}
              </DashboardTile>
            </div>

            <div className="md:col-span-full">
              <DashboardTile
                title={<Anchor href="/shows">Auftritte</Anchor>}
                titleClassName="bg-amber-500"
              >
                {dashboardData?.Show?.length ? (
                  <PreviewList className="grid gap-4 sm:grid-cols-3 sm:gap-6">
                    {dashboardData.Show.map(({ id, date, VenueText }) => (
                      <PreviewList.Item
                        key={id}
                        className="pt-0 last:border-b last:pb-3"
                        title={
                          <>
                            {VenueText[0]?.Venue.name},{" "}
                            {formatDate["dd.MM.yyyy"](date)}
                          </>
                        }
                        href={`/shows/${id}`}
                        description={
                          <>
                            <ul className="flex flex-wrap gap-2">
                              {VenueText.map(({ Text }) => {
                                return (
                                  Text && (
                                    <li key={Text.id}>
                                      <Chip>{Text.name}</Chip>
                                    </li>
                                  )
                                );
                              })}
                            </ul>
                          </>
                        }
                      />
                    ))}
                  </PreviewList>
                ) : (
                  <div className="text-sm text-gray-600">
                    Du hast noch keine Auftritte eingerichtet ☹️{" "}
                    <Anchor href="/shows">Erstelle</Anchor> Deinen ersten
                    Auftritt! ✨
                  </div>
                )}
              </DashboardTile>
            </div>

            {/* todo review this whole Tile */}
            {/* <div>
              <DashboardTile title="Rechnungen" titleClassName="bg-fuchsia-500">
                <PreviewList>
                  {dashboardData?.Invoice.map(({ id, Show }) => (
                    <PreviewList.Item
                      key={id}
                      title={`${Show.id}.pdf`} // todo This doesn't work yet
                      description={
                        <>
                          {formatDate["dd.MM.yyyy"](Show.date)} /{" "}
                          {Show.VenueText[0]?.Venue.name} /{" "}
                          {Show.VenueText[0]?.Text?.name}
                        </>
                      }
                    />
                  ))}
                </PreviewList>
              </DashboardTile>
            </div> */}
          </div>
        </Container>
      </Section>
    </Layout>
  );
};

export default Home;
