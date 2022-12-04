import { NextPage } from "next";
import { Layout } from "src/components/Layout";

const Venues: NextPage = () => {
  return (
    <Layout authGuarded>
      Venues page works!
    </Layout>
  );
};

export default Venues;
