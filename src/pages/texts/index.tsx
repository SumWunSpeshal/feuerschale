import { zodResolver } from "@hookform/resolvers/zod";
import { NextPage } from "next";
import { useForm } from "react-hook-form";
import { Layout } from "src/components/Layout";
import { TextInput } from "src/components/TextInput";
import { trpc } from "src/utils/trpc";
import { z } from "zod";

const formSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const Texts: NextPage = ({}) => {
  const { register, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });
  const { data: textData, refetch } = trpc.text.getAll.useQuery();
  const { mutate: createText, isLoading } = trpc.text.create.useMutation({
    onSuccess: () => {
      refetch();
      reset();
    },
  });
  const { mutate: deleteText } = trpc.text.delete.useMutation({
    onSuccess: () => refetch(),
  });

  return (
    <Layout authGuarded>
      <form onSubmit={handleSubmit(async (data) => createText(data))}>
        <TextInput {...register("name")} />
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
        {textData?.map(({ id, name }) => (
          <li key={id}>
            <span>{name}</span>
            <button
              type="button"
              onClick={() => deleteText({ id })}
              style={{ border: "1px solid red" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default Texts;
