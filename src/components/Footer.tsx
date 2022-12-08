type FooterProps = Record<string, unknown>;

export function Footer(props: FooterProps) {
  const {} = props;

  return (
    <footer className="sticky top-[100vh] border-t-2 border-black">
      Footer works!
    </footer>
  );
}
