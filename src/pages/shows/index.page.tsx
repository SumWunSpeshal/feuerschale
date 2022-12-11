import { zodResolver } from "@hookform/resolvers/zod";
import { NextPage } from "next";
import { useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { ChipInput } from "src/components/ChipInput";
import { Container } from "src/components/Container";
import { DateInput } from "src/components/DateInput";
import { Layout } from "src/components/Layout";
import { SelectInput } from "src/components/SelectInput";
import { formatDate } from "src/utils/format-date";
import { trpc } from "src/utils/trpc";
import { z } from "zod";

const formSchema = z.object({
  date: z.string().regex(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/, {
    message: "Kein valides Datum",
  }),
  venueId: z.number().min(1, { message: "Bitte Venue auswählen" }),
  textIds: z.union([z.string(), z.literal(false)]).array(),
});

type FormData = z.infer<typeof formSchema>;

const Shows: NextPage = () => {
  const { data: venueData } = trpc.venue.getAll.useQuery();
  const { data: textData } = trpc.text.getAll.useQuery();
  const { data: venueTextData, refetch } = trpc.show.getAll.useQuery();
  const { mutate: createShow } = trpc.show.create.useMutation({
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
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  return (
    <Layout authGuarded>
      <Container>
        <form
          onSubmit={handleSubmit(async ({ date, textIds, venueId }) => {
            createShow({
              textIds: textIds.filter(Boolean) as string[],
              venueId,
              date: new Date(date),
            });
          })}
        >
          <div className="flex gap-4 [&>*]:grow">
            <DateInput
              isEmpty={!watch("date")}
              label="Auftrittsdatum"
              {...register("date", {
                value: formatDate["yyyy-MM-dd"](new Date()),
              })}
            />
            <SelectInput
              id="venue"
              isEmpty={!watch("venueId")}
              defaultOption={{ innerText: "Venue auswählen", value: 0 }}
              options={venueData?.map(({ id, name }) => ({
                value: id,
                innerText: name,
              }))}
              {...register("venueId", {
                valueAsNumber: true,
              })}
            />
          </div>
          <br />
          {textData?.map(({ id, name }, idx) => (
            <ChipInput
              key={id}
              value={id}
              label={name}
              id={id}
              {...register(`textIds.${idx}`, {
                disabled: false,
              })}
            />
          ))}

          <br />
          <Button type="submit">Submit</Button>
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
