import { GetServerSideProps, NextPage } from "next";
import { Button } from "src/components/Button";
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

type ShowDetailPageProps = {
  id: string;
};

const ShowDetail: NextPage<ShowDetailPageProps> = ({ id }) => {
  const { data: sessionData } = trpc.auth.getSession.useQuery();

  const { data: showDetailsData } = trpc.show.getOne.useQuery({
    showId: id,
  });
  const { mutate: deleteShow } = trpc.show.delete.useMutation();

  return (
    <Layout authGuarded>
      <Container>
        <div>Show Detail</div>
        <Button onClick={() => deleteShow({ showId: id })}>Delete</Button>
        <br />
        <pre>{JSON.stringify(showDetailsData, null, 2)}</pre>
      </Container>
    </Layout>
  );
};

export default ShowDetail;
