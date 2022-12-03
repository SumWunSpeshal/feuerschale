type AutoSuggestProps<T> = {
  data: T[];
  children: JSX.Element;
  renderItem: (e: T) => JSX.Element;
};

export default function AutoSuggest<TData>(props: AutoSuggestProps<TData>) {
  const { data, children, renderItem } = props;

  return (
    <div className="relative">
      {children}
      <ul className="absolute top-full min-w-full overflow-hidden rounded-lg border-2 border-red-500 bg-white">
        {data.map((elem, idx) => {
          return (
            <li
              key={idx}
              className="cursor-pointer whitespace-nowrap px-4 py-1 transition-colors hover:bg-gray-100"
            >
              {renderItem(elem as TData)}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
