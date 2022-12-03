import { ChangeEvent, useState } from "react";
import { DebounceInput } from "react-debounce-input";
import AutoSuggest from "./AutoSuggest";
import HighlightMatch from "./HighlightMatch";

type SearchProps<TData> = {
  data: TData[] | undefined;
  onChange?: (elem: ChangeEvent<HTMLInputElement>) => void;
  onSelection?: (elem: TData) => void;
  suggestion: (elem: TData) => string;
  id: string;
};

export default function Search<TData>(props: SearchProps<TData>) {
  const { data, onChange, suggestion, id, onSelection } = props;
  const [value, setValue] = useState("");

  return (
    <AutoSuggest
      data={data ?? []}
      renderItem={(city) => (
        <HighlightMatch input={value}>{suggestion(city)}</HighlightMatch>
      )}
      onSuggestionSelect={(e: TData) => {
        onSelection?.(e);
        setValue("");
      }}
    >
      <DebounceInput
        minLength={3}
        debounceTimeout={500}
        style={{ border: "1px solid blue" }}
        onChange={(e) => {
          setValue(e.target.value);
          onChange?.(e);
        }}
        value={value}
        id={id}
        name="city-search"
      />
    </AutoSuggest>
  );
}
