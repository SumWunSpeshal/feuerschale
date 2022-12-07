type AutoSuggestProps<T> = {
  data: T[];
  children: JSX.Element;
  renderItem: (e: T) => JSX.Element | string;
  onSuggestionSelect?: (e: T) => void;
};

export function AutoSuggest<TData>(props: AutoSuggestProps<TData>) {
  const { data, children, renderItem, onSuggestionSelect } = props;

  return (
    <div className="group relative">
      {children}
      <div className="absolute top-full hidden min-w-full group-focus-within:block">
        <ul className="mt-2 divide-y-2 divide-black overflow-hidden rounded-lg border-2 border-black bg-white shadow-brutal transition-shadow group-focus-within:shadow-brutal-lg">
          {data.map((elem, idx) => {
            return (
              <li
                key={idx}
                tabIndex={0}
                onClick={() => onSuggestionSelect?.(elem)}
                onKeyDown={({ key }) => {
                  if (key === "Enter" || key === " ") {
                    onSuggestionSelect?.(elem);
                  }
                }}
                className="cursor-pointer select-none whitespace-nowrap px-4 py-2 font-normal outline-none transition-colors hover:bg-black hover:text-white focus:bg-black focus:text-white"
              >
                {renderItem(elem as TData)}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
