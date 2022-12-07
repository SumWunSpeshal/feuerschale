// eslint-disable-next-line @typescript-eslint/no-var-requires
const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderWidth: {
        3: "3px",
      },
      boxShadow: (theme) => ({
        brutal: `3px 3px 0px 0px ${theme("colors.black")}`,
        "brutal-lg": `6px 6px 0px 0px ${theme("colors.black")}`,
      }),
      transitionDuration: {
        DEFAULT: "250ms",
      },
    },
  },
  plugins: [
    plugin(({ addComponents, theme, e }) => {
      const classCollection = Object.entries(theme("width")).map(
        ([name, value]) => ({
          [`.square-${e(name)}`]: {
            width: value,
            height: value,
          },
        })
      );

      addComponents(classCollection);
    }),
  ],
};
