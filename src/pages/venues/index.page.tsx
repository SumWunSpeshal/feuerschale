import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { NextPage } from "next";
import Link from "next/link";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { Container } from "src/components/Container";
import { Highlight } from "src/components/Highlight";
import { Layout } from "src/components/Layout";
import { Search, SearchRef } from "src/components/Search";
import { Section } from "src/components/Section";
import { TextInput } from "src/components/TextInput";
import { trpc } from "src/utils/trpc";
import { z } from "zod";
import { groupVenues } from "./utils";

const formSchema = z.object({
  cityId: z.number(),
  name: z.string().min(1),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const Venues: NextPage = () => {
  const {
    data: cityData,
    mutate,
    reset: resetCities,
  } = trpc.city.search.useMutation();
  const { data: venueData, refetch } = trpc.venue.getAll.useQuery();
  const { mutate: createVenue } = trpc.venue.create.useMutation({
    onSuccess: () => {
      refetch();
      resetForm();
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

  const searchRef = useRef<SearchRef>(null);

  const groupedVenues = groupVenues(venueData);

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
            <TextInput label="Name" {...register("name")} required />
            <Search
              data={cityData}
              suggestion={(city) => city.Stadt}
              onChange={({ target }) => mutate({ value: target.value })}
              onSelection={(city) => {
                resetCities();
                setValue("cityId", city.id);
              }}
              afterSelectionMode="apply"
              id="citySearch"
              label="Stadt"
              required
              searchRef={searchRef}
            />
            <div className="col-span-full">
              <TextInput label="Beschreibung" {...register("description")} />
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
              {venues?.map(({ id, name, VenueText }) => (
                <div key={id}>
                  <Link href={"/venues/" + id} className="text-blue-700">
                    <span className="flex items-center gap-2">
                      <span
                        className={clsx(
                          "block aspect-square h-3 rounded-full border-2 border-gray-400",
                          VenueText.length && "bg-gray-400"
                        )}
                      ></span>
                      <span>{name}</span>
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Container>
    </Layout>
  );
};

export default Venues;
