import { faSearch } from "@fortawesome/free-solid-svg-icons";
import {
  ChangeEvent,
  ForwardedRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { DebounceInput } from "react-debounce-input";
import { AutoSuggest } from "./AutoSuggest";
import { Error } from "./Error";
import { HighlightMatch } from "./HighlightMatch";
import { TextInput } from "./TextInput";

export type SearchRef = {
  reset: () => void;
};

export const useSearchRef = () => useRef<SearchRef>(null);

type SearchProps<TData> = {
  data: TData[] | undefined;
  onChange?: (elem: ChangeEvent<HTMLInputElement>) => void;
  onSelection?: (elem: TData) => void;
  suggestion: (elem: TData) => string;
  afterSelectionMode?: "clear" | "apply" | "noop";
  disabled?: boolean;
  id: string;
  label?: string;
  required?: boolean;
  searchRef?: ForwardedRef<SearchRef>;
  error?: string;
};

export function SearchInput<TData>(props: SearchProps<TData>) {
  const {
    data,
    onChange,
    suggestion,
    id,
    onSelection,
    afterSelectionMode = "clear",
    disabled = false,
    searchRef,
    label,
    required,
    error,
  } = props;
  const [value, setValue] = useState("");

  useImperativeHandle(searchRef, () => ({
    reset: () => setValue(""),
  }));

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
        debounceTimeout={200}
        onChange={(e) => {
          e.target.value = e.target.value.trim();
          setValue(e.target.value);
          onChange?.(e);
        }}
        id={id}
        name={id}
        label={label || id}
        disabled={disabled}
        required={required}
        icon={faSearch}
        element={TextInput}
      />
      <Error>{error}</Error>
    </AutoSuggest>
  );
}
