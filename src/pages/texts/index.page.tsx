import { zodResolver } from "@hookform/resolvers/zod";
import { Text } from "@prisma/client";
import { NextPage } from "next";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { Container } from "src/components/Container";
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
import { deleteSlamText, maybeUploadSlamText } from "./supabase";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  slamTextFiles: isBrowser() ? z.instanceof(FileList).optional() : z.any(),
});

type FormData = z.infer<typeof formSchema>;

const Texts: NextPage = () => {
  const { data: sessionData } = trpc.auth.getSession.useQuery();
  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset: resetForm,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });
  const { data: textData, refetch } = trpc.text.getAll.useQuery();
  const { mutate: createText, isLoading } = trpc.text.create.useMutation({
    onSuccess: async ({ slamTextFileName, id }) => {
      const [file] = await getValues("slamTextFiles");

      if (file) {
        await maybeUploadSlamText({
          file,
          textId: id,
          fileName: slamTextFileName,
          userId: sessionData?.user?.id,
        });
      }

      await refetch();
      snackbarRef.current?.open({
        message: "Dein Text wurde erfolgreich erstellt",
        state: "success",
      });
      resetForm();
    },
  });
  const { mutate: deleteText } = trpc.text.delete.useMutation({
    onSuccess: async ({ id, slamTextFileName, userId }) => {
      if (slamTextFileName) {
        await deleteSlamText({
          userId,
          slamTextId: id,
          fileName: slamTextFileName,
        });
      }

      snackbarRef.current?.open({
        message: "Der Text wurde erfolgreich gelöscht",
        state: "success",
      });
      await refetch();
    },
  });

  const [textToDelete, setTextToDelete] = useState<Partial<Text>>({});

  const snackbarRef = useSnackbarRef();
  const modalRef = useModalRef();

  return (
    <Layout authGuarded>
      <Section>
        <Container>
          <div className="mb-8">
            <h2 className="text-4xl font-bold">
              Neuen <Highlight>Text</Highlight> erstellen
            </h2>
          </div>
          <form
            onSubmit={handleSubmit(async (data) => {
              const { name, description, slamTextFiles } = data;
              const [file] = Array.from((slamTextFiles as FileList) || []);

              createText({
                name,
                description,
                ...(file
                  ? { slamTextFileName: formatFileName(file.name) }
                  : {}),
              });
            })}
            className="grid grid-cols-2 gap-x-6 gap-y-6"
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
              <FileInput
                id="slamtext-upload"
                isEmpty={!watch("slamTextFiles")?.length}
                reset={() => setValue("slamTextFiles", undefined)}
                label="Slamtext"
                error={errors.slamTextFiles?.message}
                {...register("slamTextFiles")}
              />
            </div>

            <div className="col-span-full flex justify-end">
              <Button type="submit">Erstellen</Button>
            </div>
          </form>
        </Container>
      </Section>
      <Container>
        <h1>
          <strong>Texts</strong>
        </h1>
        {isLoading && <div>Loading...</div>}
        <ul>
          {textData?.map((text) => (
            <li key={text.id} className="mb-4">
              <div>
                <span>{text.name}</span>
              </div>
              {text?.slamTextFileName && (
                <div>Dateiname: {text.slamTextFileName}</div>
              )}
              <button
                type="button"
                onClick={() => {
                  setTextToDelete(text);
                  modalRef.current?.open();
                }}
                style={{ border: "1px solid red" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </Container>
      <Snackbar snackbarRef={snackbarRef} />
      <Modal.Confirm
        modalRef={modalRef}
        onConfirm={async () => {
          const { id } = textToDelete;

          if (id) {
            deleteText({ id });
            setTextToDelete({});
          }
        }}
      >
        Dieser Text wird unwiderruflich gelöscht!
      </Modal.Confirm>
    </Layout>
  );
};

export default Texts;
