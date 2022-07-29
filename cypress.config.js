const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://demo.realworld.io/#/", //hostname da nossa aplicacao
    env: {
      usuario: "test-rwx-5by5",
      test: true,
      ambiente: "dev"
    },

    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
