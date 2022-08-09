#!/usr/bin/env node

const program = require("commander");
const getReportCommand = require("../src/commands/get-report");

program.version("1.0.0", "-v, --version");

program
  .command("report [date]")
  .description("Get a full report for the day")
  .action((date) => {
    getReportCommand(date);
  });

program.parse(process.argv);
