import { zodResolver } from "@hookform/resolvers/zod";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { CheckInput } from "src/components/CheckInput";
import { ChipInput } from "src/components/ChipInput";
import { Container } from "src/components/Container";
import { DateInput } from "src/components/DateInput";
import { DownloadPreview } from "src/components/DownloadPreview";
import { FileInput } from "src/components/FileInput";
import { Highlight } from "src/components/Highlight";
import { Layout } from "src/components/Layout";
import { Modal, useModalRef } from "src/components/Modal";
import { Section } from "src/components/Section";
import { SelectInput } from "src/components/SelectInput";
import { formatDate } from "src/utils/format-date";
import { isBrowser } from "src/utils/is-browser";
import { trpc } from "src/utils/trpc";
import { z } from "zod";
import {
  deleteInvoice,
  downloadInvoice,
  formatFileName,
  maybeUploadInvoice,
} from "./supabase";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      showId: query.id,
    },
  };
};

const formSchema = z.object({
  date: z.string().regex(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/, {
    message: "Kein valides Datum",
  }),
  venueId: z.number().min(1, { message: "Bitte Venue auswählen" }),
  textIds: z.record(z.union([z.string(), z.boolean()])),
  invoiceFiles: isBrowser() ? z.instanceof(FileList).optional() : z.any(),
  issued: z.boolean().optional(),
  settled: z.boolean().optional(),
});

type FormData = z.infer<typeof formSchema>;

type ShowDetailPageProps = {
  showId: string;
};

const ShowDetail: NextPage<ShowDetailPageProps> = ({ showId }) => {
  const { data: sessionData } = trpc.auth.getSession.useQuery();
  const { data: showDetailsData, refetch: refetchShow } =
    trpc.show.getOne.useQuery({ showId });
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
  const { mutate: resetInvoiceFile } = trpc.show.resetInvoiceFile.useMutation({
    onSuccess: () => {
      refetchShow();
    },
  });

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    reset: resetForm,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const router = useRouter();
  const modalRef = useModalRef();

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

  const downloadFile = async () => {
    if (!sessionData?.user?.id || !showDetailsData?.invoiceFileName) {
      return;
    }

    await downloadInvoice(
      sessionData?.user?.id,
      showId,
      showDetailsData.invoiceFileName
    );
  };

  const deleteFile = () => {
    if (!sessionData?.user?.id || !showDetailsData?.invoiceFileName) {
      return;
    }

    deleteInvoice(
      sessionData?.user?.id,
      showId,
      showDetailsData.invoiceFileName
    );

    resetInvoiceFile({ showId });
  };

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
            onSubmit={handleSubmit(
              async ({
                date,
                textIds,
                venueId,
                issued,
                settled,
                invoiceFiles,
              }) => {
                const [file] = Array.from((invoiceFiles as FileList) || []);

                updateShow({
                  showId: showId,
                  textIds: Object.values(textIds).filter(Boolean) as string[],
                  venueId,
                  date: new Date(date),
                  issued,
                  settled,
                  ...(file
                    ? { invoiceFileName: formatFileName(file.name) }
                    : {}),
                });

                if (file) {
                  await maybeUploadInvoice({
                    file,
                    showId,
                    userId: sessionData?.user?.id,
                    fileName: formatFileName(file.name),
                  });
                }
              }
            )}
          >
            <div className="mb-14 grid gap-4 sm:grid-cols-2 sm:gap-6">
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
            <div className="mb-14">
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

            <div className="mb-14">
              <div className="mb-4">
                <h3 className="text-xl font-bold">
                  Details zu Deiner Rechnung:
                </h3>
              </div>

              <div className="flex flex-wrap gap-4 sm:gap-6">
                <CheckInput
                  id="issued"
                  label="Rechnung ausgestellt"
                  {...register("issued", {
                    value: showDetailsData?.Invoice[0]?.issued ?? false,
                  })}
                />
                <CheckInput
                  id="settled"
                  label="Rechnung beglichen"
                  {...register("settled", {
                    value: showDetailsData?.Invoice[0]?.settled ?? false,
                  })}
                />
                <div className="w-full">
                  {showDetailsData?.invoiceFileName ? (
                    <DownloadPreview
                      title="Anhang"
                      onDownload={downloadFile}
                      onDelete={deleteFile}
                    >
                      {showDetailsData.invoiceFileName}
                    </DownloadPreview>
                  ) : (
                    <FileInput
                      id="invoice-upload"
                      isEmpty={!watch("invoiceFiles")?.length}
                      reset={() => setValue("invoiceFiles", undefined)}
                      label="Rechnung"
                      error={errors.invoiceFiles?.message}
                      {...register("invoiceFiles")}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 sm:gap-6">
              <Button onClick={modalRef.current?.open} className="bg-red-400">
                Auftritt löschen
              </Button>

              <Button type="submit">Aktualisieren</Button>
            </div>
          </form>
        </Container>
      </Section>
      <Modal.Confirm
        modalRef={modalRef}
        onConfirm={() => {
          deleteShow({ showId: showId });
          router.push("/shows");
        }}
      >
        Dieser Auftritt wird unwiderruflich gelöscht!
      </Modal.Confirm>
    </Layout>
  );
};

export default ShowDetail;
