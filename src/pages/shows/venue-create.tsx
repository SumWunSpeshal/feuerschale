import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { CitySearch } from "src/components/CitySearch";
import { SearchRef } from "src/components/SearchInput";
import { TextInput } from "src/components/TextInput";
import { trpc } from "src/utils/trpc";
import { z } from "zod";

type VenueCreateProps = {
  onSuccess: () => void;
};

const venueFormSchema = z.object({
  cityId: z.number({ required_error: "Bitte aus der Liste wählen" }),
  name: z.string().min(1),
});

type VenueFormData = z.infer<typeof venueFormSchema>;

export function VenueCreate(props: VenueCreateProps) {
  const { onSuccess } = props;

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
        <div className="flex justify-end">
          <Button type="submit">Erstellen</Button>
        </div>
      </form>
    </div>
  );
}
