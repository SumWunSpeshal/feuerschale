import { zodResolver } from "@hookform/resolvers/zod";
import { GetServerSideProps, NextPage } from "next";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { Chip } from "src/components/Chip";
import { CitySearch } from "src/components/CitySearch";
import { Container } from "src/components/Container";
import { Highlight } from "src/components/Highlight";
import { Layout } from "src/components/Layout";
import { useSearchRef } from "src/components/SearchInput";
import { Section } from "src/components/Section";
import { Snackbar, useSnackbarRef } from "src/components/Snackbar";
import { TextInput } from "src/components/TextInput";
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

  const { data: venueDetailData, refetch: refetchVenue } =
    trpc.venue.getOne.useQuery({
      venueId: +venueId,
    });
  const { mutate: updateVenue } = trpc.venue.update.useMutation({
    onSuccess: async () => {
      await refetchVenue();
      snackbarRef.current?.open({
        message: "Deine Venue wurde erfolgreich aktualisiert",
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
    <Layout authGuarded hrefToListView="/venues">
      <Section>
        <Container>
          <div className="mb-8">
            <h2 className="text-4xl font-bold">
              <Highlight>Venue</Highlight> bearbeiten
            </h2>
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
            className="mb-12 grid grid-cols-2 gap-x-6 gap-y-6"
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
            <div className="col-span-full flex justify-end">
              <Button type="submit">Aktualisieren</Button>
            </div>
          </form>
          <div>
            <div className="mb-2">
              <h3 className="text-xl font-bold">🔥 Verbrannte Texte: </h3>
            </div>
            {venueDetailData?.VenueText.length ? (
              <ul className="flex flex-wrap gap-2">
                {venueDetailData?.VenueText.map(({ Text }) => {
                  return Text ? (
                    <li key={Text.id}>
                      <Chip>{Text.name}</Chip>
                    </li>
                  ) : (
                    <>Keine verbrannten Texte bisher :)</>
                  );
                })}
              </ul>
            ) : (
              <>Keine verbrannten Texte bisher :)</>
            )}
          </div>
        </Container>
      </Section>
      <Snackbar snackbarRef={snackbarRef} />
    </Layout>
  );
};

export default VenueDetail;
