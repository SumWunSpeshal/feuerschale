/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        project: "var(--font-family)",
      },
      borderWidth: {
        3: "3px",
      },
      boxShadow: (theme) => ({
        brutal: `3px 3px 0px 0px ${theme("colors.black")}`,
        "brutal-lg": `6px 6px 0px 0px ${theme("colors.black")}`,
      }),
      transitionDuration: {
        DEFAULT: "200ms",
      },
      keyframes: {
        highlight: {
          from: { backgroundSize: "0% 30%" },
          to: { backgroundSize: "97% 30%" },
        },
        "floating-nav": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        highlight:
          "highlight 700ms cubic-bezier(0, 0.55, 0.45, 1) 500ms forwards",
        "floating-nav":
          "floating-nav 200ms cubic-bezier(0, 0.55, 0.45, 1) 500ms forwards",
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
    plugin(({ theme, e, addComponents }) => {
      const classCollection = Object.entries(theme("colors")).map(
        ([name, value]) => {
          if (typeof value === "object") {
            return Object.entries(value).map(([k, v]) => {
              return {
                [`.shadow-brutal-${e(`${name}-${k}`)}`]: {
                  boxShadow: `3px 3px 0px 0px ${v}`,
                },
                [`.shadow-brutal-lg-${e(`${name}-${k}`)}`]: {
                  boxShadow: `6px 6px 0px 0px ${v}`,
                },
              };
            });
          }
          return {
            [`.shadow-brutal-${e(name)}`]: {
              boxShadow: `3px 3px 0px 0px ${value}`,
            },
            [`.shadow-brutal-lg-${e(name)}`]: {
              boxShadow: `6px 6px 0px 0px ${value}`,
            },
          };
        }
      );

      addComponents(classCollection.flat());
    }),
  ],
};
