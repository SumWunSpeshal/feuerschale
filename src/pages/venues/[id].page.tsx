import { zodResolver } from "@hookform/resolvers/zod";
import { GetServerSideProps, NextPage } from "next";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { Chip } from "src/components/Chip";
import { CitySearch } from "src/components/CitySearch";
import { Container } from "src/components/Container";
import { H2 } from "src/components/H2";
import { H4 } from "src/components/H4";
import { Highlight } from "src/components/Highlight";
import { Layout } from "src/components/Layout";
import { Modal, useModalRef } from "src/components/Modal";
import { useSearchRef } from "src/components/SearchInput";
import { Section } from "src/components/Section";
import { Snackbar, useSnackbarRef } from "src/components/Snackbar";
import { TextInput } from "src/components/TextInput";
import { Tooltip } from "src/components/Tooltip";
import { trpc } from "src/utils/trpc";
import { z } from "zod";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      venueId: query.id,
    },
  };
};

const formSchema = z.object({
  cityId: z.number({ required_error: "Bitte aus der Liste wählen" }),
  name: z.string().min(1),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

type VenueDetailPageProps = {
  venueId: string;
};

const VenueDetail: NextPage<VenueDetailPageProps> = ({ venueId }) => {
  const { data: sessionData } = trpc.auth.getSession.useQuery();

  const {
    data: venueDetailData,
    refetch: refetchVenue,
    isLoading,
  } = trpc.venue.getOne.useQuery({
    venueId: +venueId,
  });
  const { mutate: updateVenue, isLoading: updateIsLoading } =
    trpc.venue.update.useMutation({
      onSuccess: async () => {
        await refetchVenue();
        snackbarRef.current?.open({
          message: "Deine Venue wurde erfolgreich aktualisiert",
          state: "success",
        });
      },
    });
  const { mutate: deleteVenue, isLoading: deleteIsLoading } =
    trpc.venue.delete.useMutation({
      onSuccess: async () => {
        snackbarRef.current?.open({
          message: "Die Venue wurde erfolgreich gelöscht.",
          state: "success",
        });
      },
    });

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    reset: resetForm,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const searchRef = useSearchRef();
  const snackbarRef = useSnackbarRef();
  const modalRef = useModalRef();

  /**
   * @description Populate the form with existing texts and check the corresponding checkboxes
   */
  useEffect(() => {
    if (!venueDetailData) {
      return;
    }

    resetForm({
      name: venueDetailData.name,
      cityId: venueDetailData.cityId,
      description: venueDetailData.description || undefined,
    });

    searchRef.current?.set(venueDetailData.City.Stadt);
  }, [resetForm, searchRef, venueDetailData]);

  return (
    <Layout
      authGuarded
      hrefToListView="/venues"
      loadings={[isLoading, updateIsLoading, deleteIsLoading]}
    >
      <Section>
        <Container>
          <div className="mb-8">
            <H2>
              <Highlight>Venue</Highlight> bearbeiten
            </H2>
          </div>
          <form
            onSubmit={handleSubmit(async (data) => {
              const { cityId, name, description } = data;

              updateVenue({
                venueId: +venueId,
                name,
                cityId,
                description,
              });
            })}
            className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6"
          >
            <TextInput
              id="name"
              label="Name"
              required
              error={errors.name?.message}
              {...register("name")}
            />
            <CitySearch
              searchRef={searchRef}
              onSelection={(city) => setValue("cityId", city.id)}
              error={errors.cityId?.message}
            />
            <div className="col-span-full">
              <TextInput
                id="description"
                label="Beschreibung"
                error={errors.description?.message}
                {...register("description")}
              />
            </div>

            <div className="col-span-full flex justify-end gap-4 sm:gap-6">
              <div className="relative">
                <Button
                  onClick={modalRef.current?.open}
                  className="bg-red-400"
                  disabled={!!venueDetailData?.VenueText.length}
                >
                  Venue löschen
                </Button>

                {!!venueDetailData?.VenueText?.length && (
                  <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2">
                    <Tooltip>
                      ⚠️ Die Venue kann nicht gelöscht werden solange sie in
                      mindestens einem Auftritt verwendet wird.
                    </Tooltip>
                  </div>
                )}
              </div>

              <Button type="submit">Aktualisieren</Button>
            </div>
          </form>
          <div>
            <div className="mb-2">
              <H4>🔥 Verbrannte Texte: </H4>
            </div>
            {venueDetailData?.VenueText.length ? (
              <ul className="flex flex-wrap gap-2">
                {venueDetailData?.VenueText.map(({ Text }) => {
                  return Text ? (
                    <li key={Text.id}>
                      <Chip>{Text.name}</Chip>
                    </li>
                  ) : (
                    <EmptyTexts />
                  );
                })}
              </ul>
            ) : (
              <EmptyTexts />
            )}
          </div>
        </Container>
      </Section>
      <Modal.Confirm
        modalRef={modalRef}
        onConfirm={async () => {
          deleteVenue({ venueId: +venueId });
          window.location.href = "/venues"; // don't use nextjs router. This triggers refetching.
        }}
      >
        Diese Venue wird unwiderruflich gelöscht!
      </Modal.Confirm>
      <Snackbar snackbarRef={snackbarRef} />
    </Layout>
  );
};

function EmptyTexts() {
  return (
    <div className="text-gray-600">
      Keine verbrannten Texte bisher 🥳 Das Löschen der Venue ist dadurch
      möglich.
    </div>
  );
}

export default VenueDetail;
