import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { NextPage } from "next";
import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { Card } from "src/components/Card";
import { Chip } from "src/components/Chip";
import { ChipInput } from "src/components/ChipInput";
import { Container } from "src/components/Container";
import { DateInput } from "src/components/DateInput";
import { Highlight } from "src/components/Highlight";
import { Icon } from "src/components/Icon";
import { Layout } from "src/components/Layout";
import { Modal, ModalRef } from "src/components/Modal";
import { Section } from "src/components/Section";
import { SelectInput } from "src/components/SelectInput";
import { Snackbar, SnackbarRef } from "src/components/Snackbar";
import { formatDate } from "src/utils/format-date";
import { trpc } from "src/utils/trpc";
import { z } from "zod";
import { groupShows } from "./utils";
import { VenueCreate } from "./venue-create";

const formSchema = z.object({
  date: z.string().regex(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/, {
    message: "Kein valides Datum",
  }),
  venueId: z.number().min(1, { message: "Bitte Venue auswählen" }),
  textIds: z.union([z.string(), z.literal(false)]).array(),
});

type FormData = z.infer<typeof formSchema>;

const Shows: NextPage = () => {
  const { data: venueData, refetch: venueRefetch } =
    trpc.venue.getAll.useQuery();
  const { data: textData } = trpc.text.getAll.useQuery();
  const { data: showData, refetch } = trpc.show.getAll.useQuery();
  const {
    mutate: getVenueTextsByVenueId,
    data: venueTextsByVenueId,
    reset: resetVenueTextsByVenueId,
  } = trpc.venueText.getVenueTextsByVenueId.useMutation();
  const { mutate: createShow } = trpc.show.create.useMutation({
    onSuccess: () => {
      refetch();
      resetForm((values) => ({
        date: formatDate["yyyy-MM-dd"](new Date()) as string,
        venueId: 0,
        textIds: Array(values.textIds.length).fill(false),
      }));
      resetVenueTextsByVenueId();
      snackbarRef.current?.open({
        message: "Auftritt wurde erfolgreich gespeichert.",
        state: "success",
      });
    },
  });
  const { mutate: deleteShow } = trpc.show.delete.useMutation({
    onSuccess: () => {
      refetch();
      snackbarRef.current?.open({
        message: "Auftritt wurde gelöscht.",
        state: "success",
      });
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

  const snackbarRef = useRef<SnackbarRef>(null);
  const modalRef = useRef<ModalRef>(null);

  useEffect(() => {
    const { unsubscribe } = watch(({ venueId }, { name }) => {
      if (name === "venueId") {
        getVenueTextsByVenueId({ venueId: venueId || 0 });

        resetForm((values) => ({
          ...values,
          textIds: Array(values.textIds.length).fill(false),
        }));
      }
    });

    return () => unsubscribe();
  }, [getVenueTextsByVenueId, resetForm, watch]);

  const groupedShows = useMemo(() => groupShows(showData), [showData]);

  return (
    <Layout authGuarded>
      <Section>
        <Container>
          <div className="mb-8">
            <h2 className="text-4xl font-bold">
              Neuen <Highlight>Auftritt</Highlight> erstellen
            </h2>
          </div>
          <form
            onSubmit={handleSubmit(async ({ date, textIds, venueId }) => {
              createShow({
                textIds: textIds.filter(Boolean) as string[],
                venueId,
                date: new Date(date),
              });
            })}
          >
            <div className="mb-10 grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div>
                <DateInput
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
                    options={venueData?.map(({ id, name }) => ({
                      value: id,
                      innerText: name,
                    }))}
                    {...register("venueId", {
                      valueAsNumber: true,
                    })}
                  />
                </div>
                <button onClick={() => modalRef.current?.open()} type="button">
                  <Icon icon={faPlusCircle} size={32}></Icon>
                </button>
              </div>
            </div>
            <div className="mb-10">
              <div className="mb-4">
                <h3 className="text-xl font-bold">Wähle aus Deinen Texten:</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {textData?.map(({ id, name }, idx) => (
                  <ChipInput
                    key={id}
                    value={id}
                    label={name}
                    id={id}
                    warning={venueTextsByVenueId
                      ?.map(({ Text }) => Text.id)
                      .includes(id)}
                    {...register(`textIds.${idx}`, {
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
        <div className="pt-20">
          <div className="mb-10">
            <h1 className="text-6xl font-bold">
              Meine <Highlight>Auftritte</Highlight>
            </h1>
          </div>
          <div className="space-y-8">
            {Object.entries(groupedShows || {}).map(([date, shows]) => (
              <div key={date}>
                <div className="mb-4 border-b-2 border-black">
                  <h2 className="text-2xl">
                    <span>{date}</span>
                  </h2>
                </div>
                <div className="flex flex-col gap-y-2">
                  {shows?.map(({ id, VenueText, date }) => (
                    <Card
                      key={id}
                      hrefToDetailPage={"/shows/" + id}
                      header={formatDate["full"](date)}
                      onDelete={() => deleteShow({ showId: id })}
                      deleteModalChildren="Dieser Auftritt wird unwiderruflich gelöscht!"
                    >
                      <div className="mb-2 text-sm">
                        {VenueText[0]?.Venue.City.Stadt}
                      </div>
                      <ul className="flex flex-wrap gap-2">
                        {VenueText.map(({ Text }) => (
                          <li key={Text.id}>
                            <Chip>{Text.name}</Chip>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
      <Modal modalRef={modalRef} heading="Neue Venue erstellen">
        <VenueCreate
          onSuccess={() => {
            venueRefetch();
            modalRef.current?.close();
            snackbarRef.current?.open({
              message: "Die neue Venue wurde erfolgreich gespeichert.",
              state: "success",
            });
          }}
        />
      </Modal>
      <Snackbar snackbarRef={snackbarRef} />
    </Layout>
  );
};

export default Shows;
