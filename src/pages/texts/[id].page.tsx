import { zodResolver } from "@hookform/resolvers/zod";
import { GetServerSideProps, NextPage } from "next";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { Container } from "src/components/Container";
import { DownloadPreview } from "src/components/DownloadPreview";
import { FileInput } from "src/components/FileInput";
import { Highlight } from "src/components/Highlight";
import { Layout } from "src/components/Layout";
import { Modal, useModalRef } from "src/components/Modal";
import { Section } from "src/components/Section";
import { Snackbar, useSnackbarRef } from "src/components/Snackbar";
import { TextInput } from "src/components/TextInput";
import { isBrowser } from "src/utils/is-browser";
import { formatFileName } from "src/utils/string-helpers";
import { trpc } from "src/utils/trpc";
import { z } from "zod";
import {
  deleteSlamText,
  downloadSlamText,
  maybeUploadSlamText,
} from "./supabase";

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

  const { data: textDetailsData, refetch: refetchText } =
    trpc.text.getOne.useQuery({
      textId,
    });
  const { mutate: updateText } = trpc.text.update.useMutation({
    onSuccess: async () => {
      await refetchText();
      snackbarRef.current?.open({
        message: "Dein Slamtext wurde erfolgreich aktualisiert",
        state: "success",
      });
    },
  });
  const { mutate: deleteText } = trpc.text.delete.useMutation({
    onSuccess: async () => {
      snackbarRef.current?.open({
        message: "Der Slamtext wurde erfolgreich gelöscht.",
        state: "success",
      });
    },
  });
  const { mutate: resetSlamTextFileName } =
    trpc.text.resetSlamTextFileName.useMutation({
      onSuccess: () => {
        refetchText();
      },
    });

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    watch,
    reset: resetForm,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  /**
   * @description Populate the form with {textDetailsData}
   */
  useEffect(() => {
    if (!textDetailsData) {
      return;
    }

    const { name, description } = textDetailsData;

    resetForm({ name, description });
  }, [resetForm, textDetailsData]);

  const downloadFile = async () => {
    if (!sessionData?.user?.id || !textDetailsData?.slamTextFileName) {
      return;
    }

    await downloadSlamText({
      userId: sessionData?.user?.id,
      slamTextId: textId,
      fileName: textDetailsData.slamTextFileName,
    });
  };

  const deleteFile = async () => {
    if (!sessionData?.user?.id || !textDetailsData?.slamTextFileName) {
      return;
    }

    await deleteSlamText({
      userId: sessionData?.user?.id,
      slamTextId: textId,
      fileName: textDetailsData.slamTextFileName,
    });

    resetSlamTextFileName({ textId });
  };

  const snackbarRef = useSnackbarRef();
  const modalRef = useModalRef();

  return (
    <Layout authGuarded hrefToListView="/texts">
      <Section>
        <Container>
          <div className="mb-8">
            <h2 className="text-4xl font-bold">
              <Highlight>Text</Highlight> bearbeiten
            </h2>
          </div>
          <form
            className="grid grid-cols-2 gap-x-6 gap-y-6"
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
                await maybeUploadSlamText({
                  userId: sessionData?.user?.id,
                  textId,
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
                  onDownload={downloadFile}
                  onDelete={async () => {
                    await deleteFile();
                  }}
                >
                  {textDetailsData.slamTextFileName}
                </DownloadPreview>
              ) : (
                <FileInput
                  id="slamtext-upload"
                  isEmpty={!watch("slamTextFiles")?.length}
                  reset={() => setValue("slamTextFiles", undefined)}
                  label="Slamtext"
                  error={errors.slamTextFiles?.message}
                  {...register("slamTextFiles")}
                />
              )}
            </div>

            <div className="col-span-full flex justify-end gap-4 sm:gap-6">
              <Button
                type="button"
                onClick={modalRef.current?.open}
                className="bg-red-400"
                disabled={!!textDetailsData?.VenueText?.length}
              >
                Text löschen
              </Button>
              <Button type="submit">Aktualisieren</Button>
            </div>
          </form>
        </Container>
      </Section>
      <Modal.Confirm
        modalRef={modalRef}
        onConfirm={async () => {
          await deleteFile();
          deleteText({ id: textId });
          window.location.href = "/texts"; // don't use nextjs router. This triggers refetching.
        }}
      >
        Dieser Slamtext wird unwiderruflich gelöscht!
      </Modal.Confirm>
      <Snackbar snackbarRef={snackbarRef} />
    </Layout>
  );
};

export default TextDetail;
