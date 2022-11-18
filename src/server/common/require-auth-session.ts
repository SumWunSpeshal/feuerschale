import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { Session } from "next-auth";
import { getServerAuthSession } from "./get-server-auth-session";

type GsspHOF = (
  func: ({
    ctx,
    session,
  }: {
    ctx: GetServerSidePropsContext;
    session: Session | null;
  }) => ReturnType<GetServerSideProps>
) => GetServerSideProps;

export const requireAuthSession: GsspHOF = (func) => {
  return async (ctx: GetServerSidePropsContext) => {
    const session = await getServerAuthSession({ req: ctx.req, res: ctx.res });

    if (!session) {
      return {
        redirect: {
          destination: "/api/auth/signin",
          permanent: false,
        },
      };
    }

    return func({ ctx, session });
  };
};

export const sessionToServerProps: GetServerSideProps = requireAuthSession(
  async ({ session }) => {
    return {
      props: {
        session,
      },
    };
  }
);
