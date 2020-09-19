#!/usr/bin/env node

const program = require("commander");
const getReport = require("../src/commands/get-report");
const sendToJira = require("../src/commands/send-to-jira");

program.version("0.3.0", "-v, --version");

program
  .command("report [startDate]")
  .description("Get a full report for the day")
  // .option("-b --by", "Filter by 'activities' or 'mentions' (default: mentions)")
  .action(startDate => {
    getReport(startDate);
  });

program
  .command("jira [startDate]")
  .description("Send the time entries for the provided date (default: today)")
  .action(startDate => {
    sendToJira(startDate)
  });

// program
//   .command("*")
//   .description("Get total time spent for Timeular mention (Jira Issue)")
//   .action(getReport);

program.parse(process.argv);
