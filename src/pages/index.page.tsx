import type { NextPage } from "next";
import { signOut } from "next-auth/react";
import { default as Image, default as NextImage } from "next/image";
import Logo from "public/img/logo.svg";
import { Anchor } from "src/components/Anchor";
import { Button } from "src/components/Button";
import { Chip } from "src/components/Chip";
import { Container } from "src/components/Container";
import { DashboardTile } from "src/components/DashboardTile";
import { Ellipsis } from "src/components/Ellipsis";
import { H1 } from "src/components/H1";
import { Highlight } from "src/components/Highlight";
import { Layout } from "src/components/Layout";
import { PreviewList } from "src/components/PreviewList";
import { Section } from "src/components/Section";
import { formatDate } from "src/utils/format-date";
import { trpc } from "src/utils/trpc";

const Home: NextPage = () => {
  const { data: sessionData } = trpc.auth.getSession.useQuery();
  const { data: dashboardData, isLoading } = trpc.dashboard.get.useQuery();

  return (
    <Layout authGuarded noFloatingNav>
      <Section className="h-full">
        <Container>
          <div className="mb-8 sm:mb-12">
            <H1>
              <span className="font-extrabold">
                Hallo <Highlight>{sessionData?.user?.name}</Highlight>
              </span>
            </H1>
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
                title={<Anchor href="/texts">Slam-Texte</Anchor>}
                titleClassName="bg-indigo-400"
              >
                {isLoading ? (
                  <div className="grid grow animate-pulse place-items-center">
                    <Image
                      src={Logo}
                      alt="Feuerschale Lade-Animation"
                      className="grayscale"
                    />
                  </div>
                ) : !dashboardData?.texts.length ? (
                  <div className="text-sm text-gray-600">
                    Du besitzt noch keine Slam-Texte ??????{" "}
                    <Anchor href="/texts">Erstelle</Anchor> Deinen ersten
                    Slam-Text! ???
                  </div>
                ) : (
                  <PreviewList>
                    {dashboardData.texts.map(({ id, name }) => (
                      <PreviewList.Item
                        key={id}
                        title={name}
                        href={`/texts/${id}`}
                      />
                    ))}
                  </PreviewList>
                )}
              </DashboardTile>
            </div>

            <div>
              <DashboardTile
                title={<Anchor href="/venues">Venues</Anchor>}
                titleClassName="bg-sky-500"
              >
                {isLoading ? (
                  <div className="grid grow animate-pulse place-items-center">
                    <Image
                      src={Logo}
                      alt="Feuerschale Lade-Animation"
                      className="grayscale"
                    />
                  </div>
                ) : !dashboardData?.Venue?.length ? (
                  <div className="text-sm text-gray-600">
                    Du besitzt noch keine Venues ??????{" "}
                    <Anchor href="/venues">Erstelle</Anchor> Deine erste Venue!
                    ???
                  </div>
                ) : (
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
                )}
              </DashboardTile>
            </div>

            <div className="md:col-span-full">
              <DashboardTile
                title={<Anchor href="/shows">Auftritte</Anchor>}
                titleClassName="bg-amber-500"
              >
                {isLoading ? (
                  <div className="grid grow animate-pulse place-items-center">
                    <Image
                      src={Logo}
                      alt="Feuerschale Lade-Animation"
                      className="grayscale"
                    />
                  </div>
                ) : !dashboardData?.Show?.length ? (
                  <div className="text-sm text-gray-600">
                    Du hast noch keine Auftritte eingerichtet ??????{" "}
                    <Anchor href="/shows">Erstelle</Anchor> Deinen ersten
                    Auftritt! ???
                  </div>
                ) : (
                  <PreviewList className="grid gap-4 sm:grid-cols-3 sm:gap-6">
                    {dashboardData.Show.map(({ id, date, VenueText }) => (
                      <PreviewList.Item
                        key={id}
                        className="pt-0 sm:last:border-b sm:last:pb-3"
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
