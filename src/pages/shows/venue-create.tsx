import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { Search, SearchRef } from "src/components/Search";
import { TextInput } from "src/components/TextInput";
import { trpc } from "src/utils/trpc";
import { z } from "zod";

type VenueCreateProps = {
  onSuccess: () => void;
};

const venueFormSchema = z.object({
  cityId: z.number(),
  name: z.string().min(1),
});

type VenueFormData = z.infer<typeof venueFormSchema>;

export function VenueCreate(props: VenueCreateProps) {
  const { onSuccess } = props;

  const {
    data: cityData,
    mutate,
    reset: resetCities,
  } = trpc.city.search.useMutation();

  const {
    formState: { errors },
    register,
    handleSubmit,
    reset: resetForm,
    setValue,
  } = useForm<VenueFormData>({
    resolver: zodResolver(venueFormSchema),
  });

  const { mutate: createVenue } = trpc.venue.create.useMutation({
    onSuccess: () => {
      onSuccess();
      resetForm();
    },
  });

  const searchRef = useRef<SearchRef>(null);

  return (
    <div>
      <form
        onSubmit={handleSubmit(async (data) => {
          const { cityId, name } = data;
          createVenue({
            cityId,
            name,
          });
          searchRef.current?.reset();
        })}
        className="grid gap-y-6"
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
          id="city-search"
          label="Stadt"
          required
          searchRef={searchRef}
        />
        <div className="flex justify-end">
          <Button type="submit">Erstellen</Button>
        </div>
      </form>
    </div>
  );
}
