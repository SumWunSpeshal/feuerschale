type HighlightMatchProps = {
  input: string;
  children: string;
};

export default function HighlightMatch(props: HighlightMatchProps) {
  const { children, input } = props;
  const result = children.replaceAll(
    new RegExp(input, "gi"),
    "<strong>$&</strong>"
  );
  return <span dangerouslySetInnerHTML={{ __html: result }} />;
}
