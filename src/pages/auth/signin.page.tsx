import type { GetServerSideProps, NextPage } from "next";
import type { BuiltInProviderType } from "next-auth/providers";
import type { ClientSafeProvider, LiteralUnion } from "next-auth/react";
import { getProviders, signIn } from "next-auth/react";
import Image from "next/image";
import FacebookSvg from "public/img/facebook.svg";
import GoogleSvg from "public/img/google.svg";
import { BrutalElevation } from "src/components/BrutalElevation";
import { Button } from "src/components/Button";
import { Global } from "src/components/Global";

type SignIn = Record<
  LiteralUnion<BuiltInProviderType, string>,
  ClientSafeProvider
>;

const config = {
  Google: GoogleSvg,
  Facebook: FacebookSvg,
};

const SignIn: NextPage<{ providers: SignIn }> = ({ providers }) => {
  return (
    <Global>
      <div className="grid grow place-items-center bg-amber-100">
        <div className="relative max-w-xs">
          <BrutalElevation className="!top-4 !h-[calc(100%-1rem)]">
            <fieldset className="relative z-10 rounded-3xl border-2 border-black bg-white p-6 text-center">
              <legend className="rounded-md border-2 border-black bg-white px-3 text-2xl">
                <strong>Login</strong>
              </legend>
              <div className="mb-4">
                <span className="text-gray-600">
                  Melde Dich mit einem Deiner bestehenden Konten an:{" "}
                </span>
              </div>
              <div className="space-y-4">
                {Object.values(providers ?? {}).map((provider) => (
                  <div key={provider.name}>
                    <Button
                      className="w-full"
                      onClick={() =>
                        signIn(provider.id, {
                          callbackUrl: "/",
                        })
                      }
                    >
                      <div className="flex grow items-center justify-center gap-3">
                        <Image
                          src={config[provider.name as keyof typeof config]}
                          alt={`${provider.name} Provider`}
                          width={28}
                        />
                        <span>{provider.name}</span>
                      </div>
                    </Button>
                  </div>
                ))}
              </div>
            </fieldset>
          </BrutalElevation>
        </div>
      </div>
    </Global>
  );
};

export const getServerSideProps: GetServerSideProps = async () => ({
  props: { providers: await getProviders() },
});

export default SignIn;
