#!/usr/bin/env node

const program = require("commander");
const getReportCommand = require("../src/commands/get-report");
const clearCacheCommand = require("../src/commands/clear-cache");

program.version(require("../package.json").version);

program
  .command("report [date]")
  .description("Get a full report for the day")
  .action((date) => {
    getReportCommand(date);
  });

program
  .command("flush")
  .description("Flush the cache")
  .action(() => {
    clearCacheCommand();
  });

program.parse(process.argv);
