const moment = require("moment");
const timeular = require("../timeular"); // @TODO change this to just 'timeular'

let mentions = null;

const getDate = (requestedStartDate = null, requestedEndDate = null) => {
  const utcOffset = moment().utcOffset(); // Gets your system's timezone.

  if (!requestedStartDate) {
    requestedStartDate = moment().format("YYYY-MM-DD");
  }

  if (!requestedEndDate) {
    requestedEndDate = requestedStartDate;
  }

  // Gets UTC times, adjusted by the offset.
  const timeStart = moment(requestedStartDate)
    .hours(0)
    .minutes(0)
    .seconds(0)
    .milliseconds(0)
    .utc()
    .utcOffset(utcOffset, true);
  const timeEnd = moment(requestedEndDate)
    .hours(23)
    .minutes(59)
    .seconds(59)
    .milliseconds(999)
    .utc()
    .utcOffset(utcOffset, true);

  return { timeStart, timeEnd };
};

const getDateRangeForDisplay = start => {
  // @todo support date ranges larger than one day
  return start.format("MMMM Do, YYYY");
};

const getMentions = async () => {
  if (!mentions) {
    const tagsAndMentions = await timeular.api("tags-and-mentions");

    if (tagsAndMentions) {
      mentions = tagsAndMentions.mentions;
    }
  }

  return mentions;
};

const getMentionDetails = key => {
  getMentions();

  let filtered = mentions.filter(mention => mention.key == key);

  if (filtered.length > 0) {
    return filtered.pop();
  }

  return null;
};

const getDurationInHours = duration => {
  let dateDifference = moment.utc(
    moment(duration.stoppedAt).diff(moment(duration.startedAt))
  );
  let durationInSeconds = moment.duration(
    parseInt(dateDifference.seconds()) +
      parseInt(dateDifference.minutes()) * 60 +
      parseInt(dateDifference.hours()) * 60 * 60,
    "seconds"
  );

  return parseFloat(durationInSeconds.asHours());
};

module.exports = async startDate => {
  await getMentions();

  const reportOutput = [];
  let grandTotal = 0;
  let billableTotal = 0;
  let nonBillableTotal = 0;

  // Gets the date range based on settings and user input
  const { timeStart, timeEnd } = getDate(startDate);

  // Get all of the time entries that fit this range.
  const entries = await timeular.api(
    `time-entries/${timeStart.format(
      "YYYY-MM-DDTHH:mm:ss.SSS"
    )}/${timeEnd.format("YYYY-MM-DDTHH:mm:ss.SSS")}`
  );

  // For all entries, let's get the mentions, and track the time spent for each, billable and non-billable
  if (entries) {
    entries.timeEntries.forEach(entry => {
      let mentionsTracked = false;
      const timeSpent = getDurationInHours(entry.duration);
      entry.note.mentions.forEach(mention => {
        let mentionDetails = getMentionDetails(mention.key);
        if (!reportOutput[mentionDetails.label]) {
          reportOutput[mentionDetails.label] = 0;
        }

        mentionsTracked = true;
        reportOutput[mentionDetails.label] += timeSpent;
        billableTotal += timeSpent;
      });

      // No mentions, let's track this as "non-billable"
      if (!mentionsTracked) {
        nonBillableTotal += timeSpent;
      }
    });
  }

  // Format everything for display.
  const parsedReportOutput = [];
  for (const mention of Object.keys(reportOutput)) {
    // parseFloat here is just for visual purposes, so the console.table doesn't wrap it in a string.
    parsedReportOutput[mention] = parseFloat(reportOutput[mention].toFixed(2));
  }
  // @todo sort by key?

  // @todo add 'Other' time to table instead of it's own 'total' entry?

  // Calculate the grand total.
  grandTotal += billableTotal + nonBillableTotal;

  // Output all of the information
  console.log("Report for", getDateRangeForDisplay(timeStart, timeEnd));
  console.table(parsedReportOutput);
  console.log("Non-Billable : ", nonBillableTotal.toFixed(2));
  console.log("Billable     : ", billableTotal.toFixed(2));
  console.log("Total Hours  : ", grandTotal.toFixed(2));
};
