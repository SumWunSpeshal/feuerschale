import type { GetServerSideProps, NextPage } from "next";
import type { BuiltInProviderType } from "next-auth/providers";
import type { ClientSafeProvider, LiteralUnion } from "next-auth/react";
import { getProviders, signIn } from "next-auth/react";
import { Button } from "src/components/Button";
import { Global } from "src/components/Global";

type SignIn = Record<
  LiteralUnion<BuiltInProviderType, string>,
  ClientSafeProvider
>;

const SignIn: NextPage<{ providers: SignIn }> = ({ providers }) => {
  return (
    <Global>
      {Object.values(providers ?? {}).map((provider) => (
        <div key={provider.name}>
          <Button
            onClick={() =>
              signIn(provider.id, {
                callbackUrl: "/",
              })
            }
          >
            Sign in with {provider.name}
          </Button>
        </div>
      ))}
    </Global>
  );
};

export const getServerSideProps: GetServerSideProps = async () => ({
  props: { providers: await getProviders() },
});

export default SignIn;
