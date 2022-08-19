#!/usr/bin/env node

const program = require("commander");
const getReportCommand = require("../src/commands/get-report");
const clearCacheCommand = require("../src/commands/clear-cache");
const jiraTimeEntryCommand = require("../src/commands/jira-time-entry");

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

program
  .command("log [date]")
  .description("Log billable time entries to Jira")
  .action((date) => {
    jiraTimeEntryCommand(date);
  });

program.parse(process.argv);
