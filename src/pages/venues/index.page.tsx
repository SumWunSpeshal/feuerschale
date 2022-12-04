import { zodResolver } from "@hookform/resolvers/zod";
import { NextPage } from "next";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { Container } from "src/components/Container";
import { Layout } from "src/components/Layout";
import { Search, SearchRef } from "src/components/Search";
import { TextInput } from "src/components/TextInput";
import { trpc } from "src/utils/trpc";
import { z } from "zod";

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

  return (
    <Layout authGuarded>
      <Container>
        Venues page works!
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
        >
          <TextInput {...register("name")} />
          <TextInput {...register("description")} />
          <br />
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
            searchRef={searchRef}
          />
          <button type="submit">Submit</button>
        </form>
        <pre>{JSON.stringify(venueData, null, 2)}</pre>
      </Container>
    </Layout>
  );
};

export default Venues;
