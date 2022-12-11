import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { Modal, ModalRef } from "src/components/Modal";
import { Search, SearchRef } from "src/components/Search";
import { Snackbar, SnackbarRef } from "src/components/Snackbar";
import { TextInput } from "src/components/TextInput";
import { trpc } from "src/utils/trpc";
import { z } from "zod";

type VenueCreateProps = {
  refetch: () => void;
};

const venueFormSchema = z.object({
  cityId: z.number(),
  name: z.string().min(1),
});

type VenueFormData = z.infer<typeof venueFormSchema>;

export function VenueCreate(props: VenueCreateProps) {
  const { refetch } = props;

  const {
    data: cityData,
    mutate,
    reset: resetCities,
  } = trpc.city.search.useMutation();

  const { mutate: createVenue } = trpc.venue.create.useMutation({
    onSuccess: () => {
      refetch();
      resetForm();
      modalRef.current?.close();
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
  } = useForm<VenueFormData>({
    resolver: zodResolver(venueFormSchema),
  });

  const snackbarRef = useRef<SnackbarRef>(null);
  const modalRef = useRef<ModalRef>(null);
  const searchRef = useRef<SearchRef>(null);

  return (
    <>
      <Button onClick={() => modalRef.current?.open()}>Klick</Button>
      <Modal modalRef={modalRef} heading="Neue Venue erstellen">
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
            id="citySearch"
            label="Stadt"
            required
            searchRef={searchRef}
          />
          <div className="flex justify-end">
            <Button type="submit">Erstellen</Button>
          </div>
        </form>
      </Modal>
      <Snackbar snackbarRef={snackbarRef} />
    </>
  );
}
