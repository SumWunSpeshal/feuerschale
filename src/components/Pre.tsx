type PreProps = {
  data: unknown;
};

export function Pre(props: PreProps) {
  const { data } = props;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
