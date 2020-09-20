#!/usr/bin/env node

const program = require("commander");
const getReport = require("../src/commands/get-report");
const sendToJira = require("../src/commands/send-to-jira");

program.version("0.3.0");

program
  .command("report [startDate]")
  .description("Get a full report for the day (default: today)")
  // .option("-b --by", "Filter by 'activities' or 'mentions' (default: mentions)")
  .action(startDate => {
    getReport(startDate);
  });

program
  .command("send [startDate]")
  // .option("-c, --client <name>", "PM Tool to send to (currently only Jira supported)")
  .description("Send the time entries for the provided date (default: today)")
  .action(startDate => {
    sendToJira(startDate)
  });

// program
//   .command("*")
//   .description("Get total time spent for Timeular mention (Jira Issue)")
//   .action(getReport);

program.parse(process.argv);
