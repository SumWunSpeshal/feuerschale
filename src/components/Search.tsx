import {
  ChangeEvent,
  ForwardedRef,
  useImperativeHandle,
  useState,
} from "react";
import { DebounceInput } from "react-debounce-input";
import { AutoSuggest } from "./AutoSuggest";
import { HighlightMatch } from "./HighlightMatch";

export type SearchRef = {
  reset: () => void;
};

type SearchProps<TData> = {
  data: TData[] | undefined;
  onChange?: (elem: ChangeEvent<HTMLInputElement>) => void;
  onSelection?: (elem: TData) => void;
  suggestion: (elem: TData) => string;
  afterSelectionMode?: "clear" | "apply" | "noop";
  disabled?: boolean;
  id: string;
  searchRef?: ForwardedRef<SearchRef>;
};

export function Search<TData>(props: SearchProps<TData>) {
  const {
    data,
    onChange,
    suggestion,
    id,
    onSelection,
    afterSelectionMode = "clear",
    disabled = false,
    searchRef,
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
        debounceTimeout={500}
        className="border-2 border-blue-600"
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
