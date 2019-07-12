#!/usr/bin/env node

const program = require("commander");
const getReport = require("../src/commands/get-report");

program.version("0.1.1", "-v, --version");

program
  .command("report [startDate]")
  .description("Get a full report for the day")
  // .option("-b --by", "Filter by 'activities' or 'mentions' (default: mentions)")
  .action(startDate => {
    getReport(startDate);
  });

// program
//   .command("*")
//   .description("Get total time spent for Timeular mention (Jira Issue)")
//   .action(getReport);

program.parse(process.argv);
