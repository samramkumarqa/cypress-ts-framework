// The reporter ships its Node plugin and browser register file as plain JS without types.
declare module 'cypress-mochawesome-reporter/plugin' {
  const plugin: (on: Cypress.PluginEvents) => void;
  export default plugin;
}
declare module 'cypress-mochawesome-reporter/register';
