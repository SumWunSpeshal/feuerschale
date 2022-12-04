import { ChangeEvent, useState } from "react";
import { DebounceInput } from "react-debounce-input";
import AutoSuggest from "./AutoSuggest";
import HighlightMatch from "./HighlightMatch";

type SearchProps<TData> = {
  data: TData[] | undefined;
  onChange?: (elem: ChangeEvent<HTMLInputElement>) => void;
  onSelection?: (elem: TData) => void;
  suggestion: (elem: TData) => string;
  afterSelectionMode?: "clear" | "apply" | "noop";
  disabled?: boolean;
  id: string;
};

export default function Search<TData>(props: SearchProps<TData>) {
  const {
    data,
    onChange,
    suggestion,
    id,
    onSelection,
    afterSelectionMode = "clear",
    disabled = false,
  } = props;
  const [value, setValue] = useState("");

  const selectionModeActions = {
    clear: () => setValue(""),
    apply: (data: TData) => setValue(suggestion(data)),
    noop: () => null,
  };

  return (
    <AutoSuggest
      data={data ?? []}
      onSuggestionSelect={(data) => {
        selectionModeActions[afterSelectionMode](data);
        onSelection?.(data);
      }}
      renderItem={(data) => (
        <HighlightMatch input={value}>{suggestion(data)}</HighlightMatch>
      )}
    >
      <DebounceInput
        value={value}
        minLength={3}
        debounceTimeout={500}
        style={{ border: "1px solid blue" }}
        onChange={(e) => {
          setValue(e.target.value);
          onChange?.(e);
        }}
        id={id}
        name={id}
        disabled={disabled}
      />
    </AutoSuggest>
  );
}
