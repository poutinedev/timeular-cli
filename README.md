# Timeular CLI

At my current workplace we use Jira, but unfortunately it's a version that is not compatible with the integration that [Timeular](https://timeular.com) offers. So, those of us who use Timeular needed a way to generate a report of how much time we spent on each task (flagged with Mentions, per Timeular's Jira integration standard). I built this so we can add the time to our timesheets at the end of the day more quickly.

**This is a personal project, and updates to this will primarily be sporadic and as I need it. Pull Requests welcome.**

## Requirements

You have to have a Timeular account, using the Timeular app. The physical device is optional (but badass)

## Installation

Update your .bashrc or .zshrc to include the following environment variables:

```
export TIMEULAR_API_KEY="XXXXXXXXXX"
export TIMEULAR_API_SECRET="YYYYYYYYYY"
```

You can get the values for these fields by visiting your [Account page](https://profile.timeular.com/#/app/account) on Timeular

#### via NPM

```
$ npm install -g @poutine/timeular-cli
```

#### via Yarn

```
$ yarn global add @poutine/timeular-cli
```

## Updating

#### via NPM

```
$ npm update -g @poutine/timeular-cli
```

#### via Yarn

```
$ yarn global upgrade @poutine/timeular-cli@latest
```

## How to Use

### Time Report

Generates a report based on the current date, filtered by your Mentions (`@`)

```
$ timeular report
```

This will not show any time entries that have not been flagged by an `@` mention. For my purposes, this is useful, because I only need to clock time that I have flagged to Jira issues.

Example output:

```
Report for July 12th, 2019
┌───────────┬──────────┐
│  (index)  │  Values  │
├───────────┼──────────┤
│  AAA-166  │   0.07   │
│  AAA-196  │   0.68   │
│   BBB-1   │   0.11   │
│ INTERNAL  │   0.15   │
│ INTERNAL  │   1.30   │
└───────────┴──────────┘
Non-Billable :  0.35
Billable     :  2.31
Total Hours  :  2.66
```

## Road Map

- Set up the reporting so you can specify a date range rather than only be "today"
- Get specific Activity or Mentions
- Move console.log into its own library, with colors and fancy displays depending on status
- Start and stop timers
- Everything that the API currently does(?)

## Contributors

Chris Lagasse <soben@outlook.com>
