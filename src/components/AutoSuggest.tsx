type AutoSuggestProps<T> = {
  data: T[];
  children: JSX.Element;
  renderItem: (e: T) => JSX.Element | string;
  onSuggestionSelect?: (e: T) => void;
};

export default function AutoSuggest<TData>(props: AutoSuggestProps<TData>) {
  const { data, children, renderItem, onSuggestionSelect } = props;

  return (
    <div className="relative inline-flex">
      {children}
      <ul className="absolute top-full min-w-full overflow-hidden rounded-lg bg-gray-50">
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
              className="cursor-pointer select-none whitespace-nowrap px-4 py-2 outline-0 transition-colors first:pt-3 last:pb-3 hover:bg-gray-200 focus:bg-gray-200"
            >
              {renderItem(elem as TData)}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
