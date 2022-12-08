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

type TextDetailPageProps = {
  id: string;
};

const TextDetail: NextPage<TextDetailPageProps> = ({ id }) => {
  const { data: sessionData } = trpc.auth.getSession.useQuery();

  const { data: textDetailsData } = trpc.text.getOne.useQuery({
    textId: id,
  });

  return (
    <Layout authGuarded>
      <Container>
        <div>Text Detail</div>
        <br />
        <pre>{JSON.stringify(textDetailsData, null, 2)}</pre>
      </Container>
    </Layout>
  );
};

export default TextDetail;
