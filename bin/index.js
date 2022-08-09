#!/usr/bin/env node

const program = require("commander");
const getReport = require("../src/get-report");

program.version("1.0.0", "-v, --version");

program
  .command("[date]")
  .description("Get a full report for the day")
  .action((date) => {
    getReport(date);
  });

program.parse(process.argv);
