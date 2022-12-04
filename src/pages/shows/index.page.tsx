import { zodResolver } from "@hookform/resolvers/zod";
import { NextPage } from "next";
import { useForm } from "react-hook-form";
import { Container } from "src/components/Container";
import { Layout } from "src/components/Layout";
import { trpc } from "src/utils/trpc";
import { z } from "zod";

const formSchema = z.object({
  venueId: z.string().min(1), // stored as Int2 in the db because i'm an idiot. Need to convert before submitting
  textId: z.string().min(1),
});

type FormData = z.infer<typeof formSchema>;

const Shows: NextPage = () => {
  const { data: venueData } = trpc.venue.getAll.useQuery();
  const { data: textData } = trpc.text.getAll.useQuery();
  const { data: venueTextData, refetch } = trpc.venueText.getAll.useQuery();
  const { mutate: createVenueText } = trpc.venueText.create.useMutation({
    onSuccess: () => {
      refetch();
      resetForm();
    },
  });

  const {
    formState: { errors },
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
            const alreadyExists = venueTextData?.some(({ textId, venueId }) => {
              return textId === data.textId && venueId === +data.venueId;
            });

            if (alreadyExists) {
              console.error("This combination already exists!");
              return;
            }

            createVenueText({
              textId: data.textId,
              venueId: +data.venueId,
            });
          })}
        >
          <select id="venue" {...register("venueId")}>
            <option value="">Venue auswählen</option>
            {venueData?.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
          <br />
          <select id="text" {...register("textId")}>
            <option value="">Text auswählen</option>
            {textData?.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
          <br />
          <button type="submit">Submit</button>
        </form>

        <br />
        <br />
        <br />
        <br />
        <br />
        <pre>{JSON.stringify(venueTextData, null, 2)}</pre>
      </Container>
    </Layout>
  );
};

export default Shows;
