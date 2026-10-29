"use strict";

const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  testMatch: "accessibility.spec.js",
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:8767"
  },
  webServer: {
    command: "node tests/static-server.js",
    url: "http://127.0.0.1:8767/b/",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000
  }
});
