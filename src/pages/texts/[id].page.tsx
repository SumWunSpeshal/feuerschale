import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { Container } from "src/components/Container";
import { DownloadPreview } from "src/components/DownloadPreview";
import { FileInput } from "src/components/FileInput";
import { H2 } from "src/components/H2";
import { Highlight } from "src/components/Highlight";
import { Icon } from "src/components/Icon";
import { Layout } from "src/components/Layout";
import { Modal, useModalRef } from "src/components/Modal";
import { Section } from "src/components/Section";
import { Snackbar, useSnackbarRef } from "src/components/Snackbar";
import { TextInput } from "src/components/TextInput";
import { Tooltip } from "src/components/Tooltip";
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
      textId: query.id,
    },
  };
};

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  slamTextFiles: isBrowser() ? z.instanceof(FileList).optional() : z.any(),
});

type FormData = z.infer<typeof formSchema>;

type TextDetailPageProps = {
  textId: string;
};

const TextDetail: NextPage<TextDetailPageProps> = ({ textId }) => {
  const { data: sessionData } = trpc.auth.getSession.useQuery();

  const {
    data: textDetailsData,
    refetch: refetchText,
    isLoading,
    isFetchedAfterMount,
  } = trpc.text.getOne.useQuery(
    {
      textId,
    },
    {
      onSuccess: (data) => {
        if (!isFetchedAfterMount && data) {
          const { name, description } = data;
          resetForm({ name, description });
        }
      },
    }
  );
  const { mutate: updateText, isLoading: updateIsLoading } =
    trpc.text.update.useMutation({
      onSuccess: async () => {
        await refetchText();
        snackbarRef.current?.open({
          message: "Dein Slam-Text wurde erfolgreich aktualisiert",
          state: "success",
        });
      },
    });
  const { mutate: deleteText, isLoading: deleteIsLoading } =
    trpc.text.delete.useMutation({
      onSuccess: async () => {
        snackbarRef.current?.open({
          message: "Der Slam-Text wurde erfolgreich gelöscht.",
          state: "success",
        });
      },
    });
  const {
    mutate: resetSlamTextFileName,
    isLoading: resetSlamTextFileNameIsLoading,
  } = trpc.text.resetSlamTextFileName.useMutation({
    onSuccess: () => {
      refetchText();
    },
  });

  const {
    formState: { errors, isDirty },
    register,
    handleSubmit,
    setValue,
    watch,
    reset: resetForm,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const [previewLink, setPreviewLink] = useState("");

  const downloadSlamText = async () => {
    if (!sessionData?.user?.id || !textDetailsData?.slamTextFileName) {
      return;
    }

    await downloadFile({
      dir: "slam-texts",
      userId: sessionData?.user?.id,
      entityId: textId,
      fileName: textDetailsData.slamTextFileName,
    });
  };

  const deleteSlamText = async () => {
    if (!sessionData?.user?.id || !textDetailsData?.slamTextFileName) {
      return;
    }

    await deleteFile({
      dir: "slam-texts",
      userId: sessionData?.user?.id,
      entityId: textId,
      fileName: textDetailsData.slamTextFileName,
    });

    resetSlamTextFileName({ textId });
  };

  /**
   * @description Get a signed Url for the potential Slam-Text file
   */
  useEffect(() => {
    if (!textDetailsData?.slamTextFileName) {
      return;
    }

    createSignedUrl({
      dir: "slam-texts",
      fileName: textDetailsData.slamTextFileName,
      slamTextId: textDetailsData.id,
      userId: textDetailsData.userId,
    }).then((response) => {
      if (response.data) {
        setPreviewLink(response.data.signedUrl);
      }
    });
  }, [textDetailsData]);

  const snackbarRef = useSnackbarRef();
  const modalRef = useModalRef();

  return (
    <Layout
      authGuarded
      hrefToListView="/texts"
      loadings={[
        isLoading,
        updateIsLoading,
        deleteIsLoading,
        resetSlamTextFileNameIsLoading,
      ]}
    >
      <Section>
        <Container>
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button.Anchor href="/texts">
                <span className="sr-only">
                  Zurück zur Übersicht der Slam-Texte
                </span>
                <Icon icon={faArrowLeft} size={16} />
              </Button.Anchor>
              <H2>
                <Highlight>Slam-Text</Highlight> bearbeiten
              </H2>
            </div>
          </div>
          <form
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6"
            onSubmit={handleSubmit(async (data) => {
              const { name, description, slamTextFiles } = data;
              const [file] = Array.from((slamTextFiles as FileList) || []);

              updateText({
                id: textId,
                name,
                description,
                ...(file
                  ? { slamTextFileName: formatFileName(file.name) }
                  : {}),
              });

              if (file) {
                await maybeUploadFile({
                  dir: "slam-texts",
                  userId: sessionData?.user?.id,
                  entityId: textId,
                  file,
                  fileName: formatFileName(file.name),
                });
              }
            })}
          >
            <TextInput
              id="name"
              label="Name"
              required
              error={errors.name?.message}
              {...register("name")}
            />
            <TextInput
              id="description"
              label="Beschreibung"
              error={errors.description?.message}
              {...register("description")}
            />
            <div className="col-span-full">
              {textDetailsData?.slamTextFileName ? (
                <DownloadPreview
                  title="Anhang"
                  onPreviewHref={previewLink}
                  onDownload={downloadSlamText}
                  onDelete={async () => {
                    await deleteSlamText();
                    setValue("slamTextFiles", undefined);
                  }}
                >
                  {textDetailsData.slamTextFileName}
                </DownloadPreview>
              ) : (
                <FileInput
                  id="slamtext-upload"
                  isEmpty={!watch("slamTextFiles")?.length}
                  reset={() => setValue("slamTextFiles", undefined)}
                  label="Slam-Text"
                  error={errors.slamTextFiles?.message}
                  {...register("slamTextFiles")}
                />
              )}
            </div>

            <div className="col-span-full mt-2 flex justify-end gap-4 sm:gap-6">
              <div className="relative">
                <Button
                  type="button"
                  onClick={modalRef.current?.open}
                  className="bg-red-400"
                  disabled={!!textDetailsData?.VenueText?.length}
                >
                  Slam-Text löschen
                </Button>

                {!!textDetailsData?.VenueText?.length && (
                  <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2">
                    <Tooltip>
                      ⚠️ Der Slam-Text kann nicht gelöscht werden solange er in
                      mindestens einem Auftritt verwendet wird.
                    </Tooltip>
                  </div>
                )}
              </div>
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
          await deleteSlamText();
          deleteText({ id: textId });
          window.location.href = "/texts"; // don't use nextjs router. This triggers refetching.
        }}
      >
        Dieser Slam-Text wird unwiderruflich gelöscht!
      </Modal.Confirm>
      <Snackbar snackbarRef={snackbarRef} />
    </Layout>
  );
};

export default TextDetail;
