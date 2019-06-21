#!/usr/bin/env node

const program = require("commander");
const getTaskTotal = require("../src/commands/get-task-time");
const getReport = require("../src/commands/get-report");

program.version("0.1.1", "-v, --version");

program
  .command("report")
  .description("Get a full report for the day")
  // .option("-d --date", "What day to pull report from (default: today)")
  // .option("-b --by", "Filter by 'activities' or 'mentions' (default: mentions)")
  .action(getReport);

program
  .command("*")
  .description("Get total time spent for Timeular mention (Jira Issue)")
  .action(getReport);

program.parse(process.argv);
