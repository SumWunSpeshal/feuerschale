import { NextPage } from "next";
import { useState } from "react";
import { Layout } from "src/components/Layout";
import { trpc } from "src/utils/trpc";

const Texts: NextPage = ({}) => {
  const { data: textData, refetch } = trpc.text.getAll.useQuery();
  const { mutate: createText, isLoading } = trpc.text.create.useMutation({
    onSuccess: () => refetch(),
  });
  const { mutate: deleteText } = trpc.text.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const [name, setName] = useState("");

  return (
    <Layout authGuarded>
      <label htmlFor="name">
        <span>Name</span>
        <input
          type="text"
          name="name"
          id="name"
          style={{ border: "1px solid blue" }}
          onChange={({ target }) => setName(target.value)}
        />
      </label>
      <button type="button" onClick={() => createText({ name })}>
        Submit
      </button>
      <br />
      <br />
      <br />
      <br />
      <h1>
        <strong>Texts</strong>
        {isLoading && <div>Loading...</div>}
        <ul>
          {textData?.map(({ id, name }) => (
            <li key={id}>
              <span>{name}</span>
              <button
                type="button"
                onClick={() => deleteText({ id })}
                style={{ border: "1px solid red" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </h1>
    </Layout>
  );
};

export default Texts;
