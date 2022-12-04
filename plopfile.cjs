const Choices = {
  component: "component",
  page: "page",
};

module.exports = (plop) => {
  plop.setGenerator("generate", {
    description: "generate a new component",
    prompts: [
      {
        type: "list",
        name: "type",
        message: "What do you want to generate?",
        choices: Object.values(Choices),
      },
      {
        type: "input",
        name: "name",
        message: "Assign a name to your new entity",
      },
    ],
    actions: (data) => {
      switch (data.type) {
        case Choices.component:
          return [
            {
              type: "add",
              path: "src/components/{{pascalCase name}}.tsx",
              templateFile: "plop-templates/component.hbs",
            },
          ];
        case Choices.page:
          return [
            {
              type: "add",
              path: "src/pages/{{kebabCase name}}/index.page.tsx",
              templateFile: "plop-templates/page.hbs",
            },
          ];
        default:
          throw new Error(
            `Missing 'type'. A 'type' must be assigned to know what to generate!`
          );
      }
    },
  });
};
