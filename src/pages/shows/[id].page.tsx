import { zodResolver } from "@hookform/resolvers/zod";
import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { CheckInput } from "src/components/CheckInput";
import { ChipInput } from "src/components/ChipInput";
import { Container } from "src/components/Container";
import { DateInput } from "src/components/DateInput";
import { DownloadPreview } from "src/components/DownloadPreview";
import { FileInput } from "src/components/FileInput";
import { H2 } from "src/components/H2";
import { H4 } from "src/components/H4";
import { Highlight } from "src/components/Highlight";
import { Layout } from "src/components/Layout";
import { Modal, useModalRef } from "src/components/Modal";
import { Section } from "src/components/Section";
import { SelectInput } from "src/components/SelectInput";
import { Snackbar, useSnackbarRef } from "src/components/Snackbar";
import { formatDate } from "src/utils/format-date";
import { isBrowser } from "src/utils/is-browser";
import { formatFileName } from "src/utils/string-helpers";
import {
  createSignedUrl,
  deleteFile,
  downloadFile,
  maybeUploadFile,
} from "src/utils/supabase";
import { trpc } from "src/utils/trpc";
import { z } from "zod";

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
  const {
    data: showDetailsData,
    refetch: refetchShow,
    isLoading,
    isFetchedAfterMount,
  } = trpc.show.getOne.useQuery(
    { showId },
    {
      onSuccess: (data) => {
        if (!isFetchedAfterMount && data?.VenueText[0]) {
          resetForm({
            date: formatDate["yyyy-MM-dd"](data.date) as string,
            venueId: data.VenueText[0].venueId,
            textIds: data.VenueText.map((item) => item.textId)
              .filter((textId): textId is string => !!textId)
              .reduce(
                (acc, curr) => ({
                  ...acc,
                  [curr]: curr,
                }),
                {}
              ),
          });
        }
      },
    }
  );
  const { mutate: deleteShow, isLoading: deleteIsLoading } =
    trpc.show.delete.useMutation();
  const { mutate: updateShow, isLoading: updateIsLoading } =
    trpc.show.update.useMutation({
      onSuccess: async () => {
        await refetchShow();
        snackbarRef.current?.open({
          message: "Dein Auftritt wurde erfolgreich aktualisiert",
          state: "success",
        });
      },
    });
  const { data: textData, isLoading: textIsLoading } =
    trpc.text.getAll.useQuery();
  const { data: venueData, isLoading: venueIsLoading } =
    trpc.venue.getAll.useQuery();
  const {
    mutate: getVenueTextsByVenueId,
    data: venueTextsByVenueId,
    isLoading: venueTextsByVenueIdIsLoading,
  } = trpc.venueText.getVenueTextsByVenueId.useMutation();
  const { mutate: resetInvoiceFile, isLoading: resetInvoiceFileIsLoading } =
    trpc.show.resetInvoiceFileName.useMutation({
      onSuccess: () => {
        refetchShow();
      },
    });

  const {
    formState: { errors, isDirty },
    register,
    handleSubmit,
    setValue,
    reset: resetForm,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const [previewLink, setPreviewLink] = useState("");

  const modalRef = useModalRef();
  const snackbarRef = useSnackbarRef();

  /**
   * @description Get all texts for a given Venue to indicate used Texts
   */
  useEffect(() => {
    const venueId = showDetailsData?.VenueText[0]?.venueId;

    if (venueId) {
      getVenueTextsByVenueId({ venueId });
    }
  }, [getVenueTextsByVenueId, showDetailsData]);

  /**
   * @description Get a signed Url for the potential Invoice file
   */
  useEffect(() => {
    if (!showDetailsData?.invoiceFileName) {
      return;
    }

    createSignedUrl({
      dir: "invoices",
      fileName: showDetailsData.invoiceFileName,
      slamTextId: showDetailsData.id,
      userId: showDetailsData.userId,
    }).then((response) => {
      if (response.data) {
        setPreviewLink(response.data.signedUrl);
      }
    });
  }, [showDetailsData]);

  const downloadInvoice = async () => {
    if (!sessionData?.user?.id || !showDetailsData?.invoiceFileName) {
      return;
    }

    await downloadFile({
      dir: "invoices",
      userId: sessionData?.user?.id,
      entityId: showId,
      fileName: showDetailsData.invoiceFileName,
    });
  };

  const deleteInvoice = async () => {
    if (!sessionData?.user?.id || !showDetailsData?.invoiceFileName) {
      return;
    }

    await deleteFile({
      dir: "invoices",
      userId: sessionData?.user?.id,
      entityId: showId,
      fileName: showDetailsData.invoiceFileName,
    });

    resetInvoiceFile({ showId });
  };

  const getAlreadyUsedTexts = (id: string) => {
    return venueTextsByVenueId
      ?.filter(
        ({ id }) => !showDetailsData?.VenueText.find((item) => item.id === id)
      )
      .map(({ Text }) => Text?.id)
      .includes(id);
  };

  return (
    <Layout
      authGuarded
      hrefToListView="/shows"
      loadings={[
        isLoading,
        deleteIsLoading,
        updateIsLoading,
        textIsLoading,
        venueIsLoading,
        venueTextsByVenueIdIsLoading,
        resetInvoiceFileIsLoading,
      ]}
    >
      <Section>
        <Container>
          <div className="mb-8">
            <H2>
              <Highlight>Auftritt</Highlight> bearbeiten
            </H2>
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
                  await maybeUploadFile({
                    dir: "invoices",
                    file,
                    entityId: showId,
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
                <H4>Wähle aus Deinen Slam-Texten:</H4>
              </div>
              <div className="flex flex-wrap gap-2">
                {textData?.map(({ id, name }) => (
                  <ChipInput
                    key={id}
                    value={id}
                    label={name}
                    id={id}
                    warning={getAlreadyUsedTexts(id)}
                    {...register(`textIds.${id}`, {
                      disabled: false,
                    })}
                  />
                ))}
              </div>
            </div>

            <div className="mb-14">
              <div className="mb-4">
                <H4>Details zu Deiner Rechnung:</H4>
              </div>

              <div className="flex flex-wrap gap-4 sm:gap-6">
                <CheckInput
                  id="issued"
                  label="Rechnung ausgestellt"
                  {...register("issued", {
                    value: showDetailsData?.Invoice?.issued ?? false,
                  })}
                />
                <CheckInput
                  id="settled"
                  label="Rechnung beglichen"
                  {...register("settled", {
                    value: showDetailsData?.Invoice?.settled ?? false,
                  })}
                />
                <div className="w-full">
                  {showDetailsData?.invoiceFileName ? (
                    <DownloadPreview
                      title="Anhang"
                      onPreviewHref={previewLink}
                      onDownload={downloadInvoice}
                      onDelete={async () => {
                        await deleteInvoice();
                        setValue("invoiceFiles", undefined);
                      }}
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

              <Button type="submit" disabled={!isDirty}>
                Aktualisieren
              </Button>
            </div>
          </form>
        </Container>
      </Section>
      <Modal.Confirm
        modalRef={modalRef}
        onConfirm={async () => {
          await deleteInvoice();
          deleteShow({ showId });
          window.location.href = "/shows"; // don't use nextjs router. This triggers refetching.
        }}
      >
        Dieser Auftritt wird unwiderruflich gelöscht!
      </Modal.Confirm>
      <Snackbar snackbarRef={snackbarRef} />
    </Layout>
  );
};

export default ShowDetail;
