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

type VenueTextDetailPageProps = {
  id: string;
};

const VenueTextDetail: NextPage<VenueTextDetailPageProps> = ({ id }) => {
  const { data: sessionData } = trpc.auth.getSession.useQuery();

  const { data: venueTextDetailsData } = trpc.venueText.getOne.useQuery({
    venueTextId: id,
  });

  return (
    <Layout authGuarded>
      <Container>
        <div>VenueText Detail</div>
        <br />
        <pre>{JSON.stringify(venueTextDetailsData, null, 2)}</pre>
      </Container>
    </Layout>
  );
};

export default VenueTextDetail;
