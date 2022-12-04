import { GetServerSideProps, NextPage } from "next";
import { Container } from "src/components/Container";
import { Layout } from "src/components/Layout";
import { trpc } from "src/utils/trpc";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      id: query.id,
    },
  };
};

type VenuesDetailPageProps = {
  id: string;
};

const Venues: NextPage<VenuesDetailPageProps> = ({ id }) => {
  const { data: venueDetailsData } = trpc.venue.getOne.useQuery({
    venueId: id,
  });

  return (
    <Layout authGuarded>
      <Container>
        <pre>{JSON.stringify(venueDetailsData, null, 2)}</pre>
      </Container>
    </Layout>
  );
};

export default Venues;
