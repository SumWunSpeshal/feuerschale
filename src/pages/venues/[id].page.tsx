import { zodResolver } from "@hookform/resolvers/zod";
import { GetServerSideProps, NextPage } from "next";
import { useForm } from "react-hook-form";
import { Container } from "src/components/Container";
import { Layout } from "src/components/Layout";
import { TextInput } from "src/components/TextInput";
import { isBrowser } from "src/utils/is-browser";
import { assertUserBucketExists } from "src/utils/supabase";
import { trpc } from "src/utils/trpc";
import { z } from "zod";
import { maybeUploadInvoice } from "./supabase";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      id: query.id,
    },
  };
};

const formSchema = z.object({
  venueTextId: z.string().min(1),
  files: isBrowser() ? z.instanceof(FileList).optional() : z.any(),
});

type FormData = {
  venueTextId: string;
  files?: FileList;
};

type VenuesDetailPageProps = {
  id: string;
};

const Venues: NextPage<VenuesDetailPageProps> = ({ id }) => {
  const { data: sessionData } = trpc.auth.getSession.useQuery();

  const { data: venueDetailsData } = trpc.venue.getOne.useQuery({
    venueId: id,
  });

  const { mutate: createInvoice } = trpc.invoice.create.useMutation();

  const {
    register,
    handleSubmit,
    reset: resetForm,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  return (
    <Layout authGuarded>
      <Container>
        <form
          onSubmit={handleSubmit(async (data) => {
            const { files, venueTextId } = data;
            await assertUserBucketExists(sessionData?.user?.id);
            await maybeUploadInvoice(sessionData, files?.[0], venueTextId);
            createInvoice({ venueTextId });
            resetForm();
          })}
        >
          <TextInput {...register("venueTextId")} />
          <br />
          <label htmlFor="upload">
            <span>Upload</span>
            <input id="upload" type="file" {...register("files")}></input>
          </label>
          <button type="submit">Submit</button>
        </form>
        <pre>{JSON.stringify(venueDetailsData, null, 2)}</pre>

        {venueDetailsData?.VenueText.map(({ Text: { id: textId } }) => (
          <div key={textId}>asd</div>
        ))}
      </Container>
    </Layout>
  );
};

export default Venues;
