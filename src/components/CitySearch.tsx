import { City } from "@prisma/client";
import { ForwardedRef, useId } from "react";
import { trpc } from "src/utils/trpc";
import { SearchInput, SearchRef } from "./SearchInput";

type CitySearchProps = {
  searchRef?: ForwardedRef<SearchRef>;
  onSelection?: (city: City) => void;
  error?: string;
};

export function CitySearch(props: CitySearchProps) {
  const { searchRef, onSelection, error } = props;

  const id = useId();

  const {
    data: cityData,
    mutate,
    reset: resetCities,
  } = trpc.city.search.useMutation();

  return (
    <SearchInput
      data={cityData}
      suggestion={(city) => city.Stadt}
      onChange={({ target }) => mutate({ value: target.value })}
      onSelection={(city) => {
        resetCities();
        onSelection?.(city);
      }}
      afterSelectionMode="apply"
      id={id}
      label="Stadt"
      required
      searchRef={searchRef}
      error={error}
    />
  );
}
