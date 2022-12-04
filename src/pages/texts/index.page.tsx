import { zodResolver } from "@hookform/resolvers/zod";
import { NextPage } from "next";
import { useForm } from "react-hook-form";
import { Container } from "src/components/Container";
import { Layout } from "src/components/Layout";
import { TextInput } from "src/components/TextInput";
import { isBrowser } from "src/utils/is-browser";
import { trpc } from "src/utils/trpc";
import { z } from "zod";
import { maybeUploadSlamText } from "./supabase";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  files: isBrowser() ? z.instanceof(FileList).optional() : z.any(),
});

type FormData = {
  description?: string;
  files?: FileList;
  name: string;
};

const Texts: NextPage = () => {
  const { data: sessionData } = trpc.auth.getSession.useQuery();
  const {
    register,
    handleSubmit,
    reset: resetForm,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });
  const { data: textData, refetch } = trpc.text.getAll.useQuery();
  const { mutate: createText, isLoading } = trpc.text.create.useMutation({
    onSuccess: () => {
      refetch();
      resetForm();
    },
  });
  const { mutate: deleteText } = trpc.text.delete.useMutation({
    onSuccess: () => refetch(),
  });

  return (
    <Layout authGuarded>
      <Container>
        <form
          onSubmit={handleSubmit(async (data) => {
            const { files, ...rest } = data;
            const fileName = files?.[0]?.name
              ? `${Date.now()}_${files?.[0].name}`
              : undefined;
            await maybeUploadSlamText(sessionData, files?.[0], fileName);
            createText({ ...rest, slamTextFileName: fileName });
          })}
        >
          <TextInput {...register("name")} />
          <br />
          <label htmlFor="upload">
            <span>Upload</span>
            <input id="upload" type="file" {...register("files")}></input>
          </label>
          <button type="submit">Submit</button>
        </form>
        <br />
        <br />
        <br />
        <br />
        <h1>
          <strong>Texts</strong>
        </h1>
        {isLoading && <div>Loading...</div>}
        <ul>
          {textData?.map(({ id, name, slamTextFileName }) => (
            <li key={id} className="mb-4">
              <div>
                <span>{name}</span>
              </div>
              {slamTextFileName && <div>Dateiname: {slamTextFileName}</div>}
              <button
                type="button"
                onClick={() => deleteText({ id, slamTextFileName })}
                style={{ border: "1px solid red" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </Container>
    </Layout>
  );
};

export default Texts;
