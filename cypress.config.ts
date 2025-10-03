import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
     baseUrl: 'https://stag-plantbot.netlify.app/',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    video: true,
    screenshotOnRunFailure: true,
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    projectId: "hsi92h"
  },
});
