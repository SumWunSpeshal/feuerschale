import { zodResolver } from "@hookform/resolvers/zod";
import { NextPage } from "next";
import { useForm } from "react-hook-form";
import { Layout } from "src/components/Layout";
import Search from "src/components/Search";
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
    reset,
  } = trpc.city.searchCities.useMutation();
  const { data: venueData, refetch } = trpc.venue.getAll.useQuery();
  const { mutate: createVenue } = trpc.venue.create.useMutation({
    onSuccess: () => {
      refetch();
      resetForm();
    },
  });

  const {
    register,
    handleSubmit,
    reset: resetForm,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  return (
    <Layout authGuarded>
      Venues page works!
      <form
        onSubmit={handleSubmit(async (data) => {
          const { cityId, name, description } = data;

          createVenue({
            cityId,
            name,
            description,
          });
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
            reset();
            setValue("cityId", city.id);
          }}
          afterSelectionMode="apply"
          id="citySearch"
        />
        <button type="submit">Submit</button>
      </form>
      <pre>{JSON.stringify(venueData, null, 2)}</pre>
    </Layout>
  );
};

export default Venues;
