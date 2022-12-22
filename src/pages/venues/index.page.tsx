import { zodResolver } from "@hookform/resolvers/zod";
import { NextPage } from "next";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { Card } from "src/components/Card";
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
import { groupVenues } from "./utils";

const formSchema = z.object({
  cityId: z.number({ required_error: "Bitte aus der Liste wählen" }),
  name: z.string().min(1),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const Venues: NextPage = () => {
  const { data: venueData, refetch } = trpc.venue.getAll.useQuery();
  const { mutate: createVenue } = trpc.venue.create.useMutation({
    onSuccess: async () => {
      await refetch();
      resetForm();
      snackbarRef.current?.open({
        message: "Die neue Venue wurde erfolgreich gespeichert.",
        state: "success",
      });
    },
  });
  const { mutate: deleteVenue } = trpc.venue.delete.useMutation({
    onSuccess: async () => {
      await refetch();
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
    reset: resetForm,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const snackbarRef = useSnackbarRef();
  const searchRef = useSearchRef();

  const groupedVenues = useMemo(() => groupVenues(venueData), [venueData]);

  return (
    <Layout authGuarded>
      <Section>
        <Container>
          <div className="mb-8">
            <h2 className="text-4xl font-bold">
              Neue <Highlight>Venue</Highlight> erstellen
            </h2>
          </div>
          <form
            onSubmit={handleSubmit(async (data) => {
              const { cityId, name, description } = data;
              createVenue({
                cityId,
                name,
                description,
              });
              searchRef.current?.reset();
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
              <Button type="submit">Erstellen</Button>
            </div>
          </form>
        </Container>
      </Section>
      <Container>
        <div className="pt-20">
          <div className="mb-10">
            <h1 className="text-6xl font-bold">
              Meine <Highlight>Venues</Highlight>
            </h1>
          </div>
          <div className="space-y-8">
            {Object.entries(groupedVenues || {}).map(([cityName, venues]) => (
              <div key={cityName}>
                <div className="mb-4">
                  <h2 className="text-2xl">
                    <span>{cityName}</span>
                  </h2>
                </div>
                <div className="flex flex-col gap-y-2">
                  {venues?.map(({ id, VenueText, name, description }) => (
                    <Card
                      key={id}
                      hrefToDetailPage={"/venues/" + id}
                      header={name}
                      onDelete={
                        !VenueText?.length
                          ? () => deleteVenue({ venueId: id })
                          : undefined
                      }
                      deleteModalChildren="Diese Venue wird unwiderruflich gelöscht!"
                    >
                      {(() => {
                        if (
                          description ||
                          VenueText.some(({ Text }) => !!Text)
                        ) {
                          return (
                            <>
                              {description && (
                                <div className="mb-2 text-sm">
                                  {description}
                                </div>
                              )}

                              {VenueText.some(({ Text }) => !!Text) && (
                                <ul className="mt-1 flex flex-wrap gap-2">
                                  {VenueText.map(({ Text }) => {
                                    return (
                                      Text && (
                                        <li key={Text.id}>
                                          <Chip>{Text.name}</Chip>
                                        </li>
                                      )
                                    );
                                  })}
                                </ul>
                              )}
                            </>
                          );
                        }
                      })()}
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
      <Snackbar snackbarRef={snackbarRef} />
    </Layout>
  );
};

export default Venues;
