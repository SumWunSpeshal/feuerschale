import { faFile } from "@fortawesome/free-solid-svg-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { NextPage } from "next";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { Card } from "src/components/Card";
import { Container } from "src/components/Container";
import { FileInput } from "src/components/FileInput";
import { H1 } from "src/components/H1";
import { H2 } from "src/components/H2";
import { H3 } from "src/components/H3";
import { Highlight } from "src/components/Highlight";
import { Icon } from "src/components/Icon";
import { Layout } from "src/components/Layout";
import { ListView } from "src/components/ListView";
import { Section } from "src/components/Section";
import { Snackbar, useSnackbarRef } from "src/components/Snackbar";
import { TextInput } from "src/components/TextInput";
import { isBrowser } from "src/utils/is-browser";
import { formatFileName } from "src/utils/string-helpers";
import { deleteFile, maybeUploadFile } from "src/utils/supabase";
import { trpc } from "src/utils/trpc";
import { z } from "zod";
import { groupTexts } from "./utils";

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
  const { data: textData, refetch, isLoading } = trpc.text.getAll.useQuery();
  const { mutate: createText, isLoading: createIsLoading } =
    trpc.text.create.useMutation({
      onSuccess: async ({ slamTextFileName, id }) => {
        const [file] = await getValues("slamTextFiles");

        if (file) {
          await maybeUploadFile({
            dir: "slam-texts",
            entityId: id,
            file,
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
  const { mutate: deleteText, isLoading: deleteIsLoading } =
    trpc.text.delete.useMutation({
      onSuccess: async ({ id, slamTextFileName, userId }) => {
        if (slamTextFileName) {
          await deleteFile({
            dir: "slam-texts",
            userId,
            entityId: id,
            fileName: slamTextFileName,
          });
        }

        snackbarRef.current?.open({
          message: "Der Text wurde erfolgreich gel??scht",
          state: "success",
        });
        await refetch();
      },
    });

  const snackbarRef = useSnackbarRef();

  const groupedTexts = useMemo(() => groupTexts(textData), [textData]);

  return (
    <Layout
      authGuarded
      loadings={[isLoading, deleteIsLoading, createIsLoading]}
    >
      <Section>
        <Container>
          <div className="mb-8">
            <H2>
              Neuen <Highlight>Slam-Text</Highlight> erstellen
            </H2>
          </div>
          <form
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6"
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
                label="Slam-Text"
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
        <ListView>
          <div className="mb-6 sm:mb-10">
            <H1>
              Meine <Highlight>Slam-Texte</Highlight>
            </H1>
          </div>
          <div className="space-y-8">
            {Object.entries(groupedTexts || {}).map(([category, texts]) => (
              <div key={category}>
                <div className="mb-4">
                  <H3>
                    <span>{category}</span>
                  </H3>
                </div>
                <div className="flex flex-col gap-y-2">
                  {texts?.map((text) => {
                    const {
                      id,
                      VenueText,
                      name,
                      description,
                      slamTextFileName,
                    } = text;

                    return (
                      <Card
                        key={id}
                        hrefToDetailPage={"/texts/" + id}
                        header={name}
                        onDelete={
                          !VenueText?.length
                            ? () => deleteText({ id })
                            : undefined
                        }
                        deleteModalChildren="Dieser Text wird unwiderruflich gel??scht!"
                      >
                        {description && (
                          <div className="text-sm">{description}</div>
                        )}
                        {slamTextFileName && (
                          <div className="mt-1 flex gap-2 text-sm text-gray-500">
                            <Icon icon={faFile} />
                            <span>{slamTextFileName}</span>
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ListView>
      </Container>
      <Snackbar snackbarRef={snackbarRef} />
    </Layout>
  );
};

export default Texts;
