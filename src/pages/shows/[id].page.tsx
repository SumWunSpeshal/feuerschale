import { zodResolver } from "@hookform/resolvers/zod";
import { GetServerSideProps, NextPage } from "next";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { CheckInput } from "src/components/CheckInput";
import { ChipInput } from "src/components/ChipInput";
import { Container } from "src/components/Container";
import { DateInput } from "src/components/DateInput";
import { Highlight } from "src/components/Highlight";
import { Layout } from "src/components/Layout";
import { Section } from "src/components/Section";
import { SelectInput } from "src/components/SelectInput";
import { formatDate } from "src/utils/format-date";
import { trpc } from "src/utils/trpc";
import { z } from "zod";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      id: query.id,
    },
  };
};

const formSchema = z.object({
  date: z.string().regex(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/, {
    message: "Kein valides Datum",
  }),
  venueId: z.number().min(1, { message: "Bitte Venue auswählen" }),
  textIds: z.record(z.union([z.string(), z.boolean()])),
  invoiceFileName: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

type ShowDetailPageProps = {
  id: string;
};

const ShowDetail: NextPage<ShowDetailPageProps> = ({ id }) => {
  const { data: showDetailsData, refetch: refetchShow } =
    trpc.show.getOne.useQuery({
      showId: id,
    });
  const { mutate: deleteShow } = trpc.show.delete.useMutation();
  const { mutate: updateShow } = trpc.show.update.useMutation({
    onSuccess: () => {
      refetchShow();
    },
  });
  const { data: textData } = trpc.text.getAll.useQuery();
  const { data: venueData } = trpc.venue.getAll.useQuery();
  const { mutate: getVenueTextsByVenueId, data: venueTextsByVenueId } =
    trpc.venueText.getVenueTextsByVenueId.useMutation();

  const {
    formState: { errors },
    register,
    handleSubmit,
    reset: resetForm,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  /**
   * @description Populate the form with existing texts and check the corresponding checkboxes
   */
  useEffect(() => {
    if (!showDetailsData || !showDetailsData.VenueText[0]) {
      return;
    }

    resetForm({
      date: formatDate["yyyy-MM-dd"](showDetailsData.date) as string,
      venueId: showDetailsData.VenueText[0].venueId,
      textIds: showDetailsData.VenueText.map((item) => item.textId)
        .filter((textId): textId is string => !!textId)
        .reduce(
          (acc, curr) => ({
            ...acc,
            [curr]: curr,
          }),
          {}
        ),
    });
  }, [showDetailsData, resetForm]);

  /**
   * @description Get all texts for a given Venue to indicate used Texts
   */
  useEffect(() => {
    const venueId = showDetailsData?.VenueText[0]?.venueId;

    if (venueId) {
      getVenueTextsByVenueId({ venueId });
    }
  }, [getVenueTextsByVenueId, showDetailsData]);

  return (
    <Layout authGuarded>
      <Section>
        <Container>
          <div className="mb-8">
            <h2 className="text-4xl font-bold">
              <Highlight>Auftritt</Highlight> bearbeiten
            </h2>
          </div>
          <form
            onSubmit={handleSubmit(async ({ date, textIds, venueId }) => {
              updateShow({
                showId: id,
                textIds: Object.values(textIds).filter(Boolean) as string[],
                venueId,
                date: new Date(date),
              });
            })}
          >
            <div className="mb-10 grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div>
                <DateInput
                  id="date"
                  isEmpty={!watch("date")}
                  required
                  label="Auftrittsdatum"
                  error={errors.date?.message}
                  {...register("date", {
                    value: formatDate["yyyy-MM-dd"](new Date()),
                  })}
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="grow">
                  <SelectInput
                    id="venue"
                    isEmpty={!watch("venueId")}
                    defaultOption={{ innerText: "Venue auswählen", value: 0 }}
                    required
                    error={errors.venueId?.message}
                    options={venueData?.map(({ id, name, City }) => ({
                      value: id,
                      innerText: `${name}, ${City.Stadt}`,
                    }))}
                    {...register("venueId", {
                      valueAsNumber: true,
                    })}
                  />
                </div>
              </div>
            </div>
            <div className="mb-10">
              <div className="mb-4">
                <h3 className="text-xl font-bold">Wähle aus Deinen Texten:</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {textData?.map(({ id, name }) => (
                  <ChipInput
                    key={id}
                    value={id}
                    label={name}
                    id={id}
                    warning={venueTextsByVenueId
                      ?.map(({ Text }) => Text?.id)
                      .includes(id)}
                    {...register(`textIds.${id}`, {
                      disabled: false,
                    })}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">Erstellen</Button>
            </div>
          </form>
        </Container>
      </Section>
      <Container>
        <div>Show Detail</div>
        <Button onClick={() => deleteShow({ showId: id })}>Delete</Button>
        <br />
        <CheckInput id="test" label="My checkbox" />
        <pre>{JSON.stringify(showDetailsData, null, 2)}</pre>
      </Container>
    </Layout>
  );
};

export default ShowDetail;
