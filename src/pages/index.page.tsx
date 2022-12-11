import type { NextPage } from "next";
import { signOut } from "next-auth/react";
import NextImage from "next/image";
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
  const { data: dashboardData } = trpc.dashboard.get.useQuery();

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
            <div className="col-span-2">
              <DashboardTile
                title={<Anchor href="/shows">Auftritte</Anchor>}
                titleClassName="bg-amber-500"
              >
                <PreviewList className="grid grid-cols-2 gap-4 space-y-0 !divide-y-0">
                  {dashboardData?.Show.map(({ id, date, VenueText }) => (
                    <PreviewList.Item
                      key={id}
                      className="py-0"
                      title={formatDate["dd.MM.yyyy"](date)}
                      href={`/shows/${id}`}
                      description={
                        <>
                          <ul className="list-inside list-disc">
                            {VenueText.map(({ Text }) => (
                              <li key={Text.id}>{Text.name}</li>
                            ))}
                          </ul>
                          <span>in {VenueText[0]?.Venue.City.Stadt}</span>
                        </>
                      }
                    />
                  ))}
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

            <div>
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
                          {Show.VenueText[0]?.Text.name}
                        </>
                      }
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
