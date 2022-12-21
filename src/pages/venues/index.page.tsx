import { zodResolver } from "@hookform/resolvers/zod";
import { NextPage } from "next";
import Link from "next/link";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button } from "src/components/Button";
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
    onSuccess: () => {
      refetch();
      resetForm();
      snackbarRef.current?.open({
        message: "Die neue Venue wurde erfolgreich gespeichert.",
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
      <pre className="hidden">{JSON.stringify(venueData, null, 2)}</pre>
      <Container>
        <div className="space-y-4 pt-20">
          <div className="mb-8">
            <h2 className="text-6xl font-bold">
              Meine <Highlight>Venues</Highlight>
            </h2>
          </div>
          {Object.entries(groupedVenues || {}).map(([cityName, venues]) => (
            <div key={cityName}>
              <h2 className="text-xl">
                <strong>{cityName}</strong>
              </h2>
              {venues?.map(({ id, name }) => (
                <div key={id}>
                  <Link href={"/venues/" + id} className="text-blue-700">
                    {name}
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Container>
      <Snackbar snackbarRef={snackbarRef} />
    </Layout>
  );
};

export default Venues;
