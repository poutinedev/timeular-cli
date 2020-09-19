const date = require("../data/get-date");
const getMentions = require("../data/get-timeular-mentions");
const getEntries = require("../data/get-timeular-entries");

const getDateRangeForDisplay = start => {
  // @todo support date ranges larger than one day
  let string = start.format("MMMM Do, YYYY");

  return string;
};

module.exports = async startDate => {
  try {
    // Gets the date range based on settings and user input
    const { timeStart, timeEnd } = date.getRange(startDate);

    const reportOutput = [];
    let grandTotal = 0;
    let billableTotal = 0;
    let nonBillableTotal = 0;

    // Get all 'mentions' available.
    await getMentions.prep();

    // Get all of the time entries that fit this range.
    const entries = await getEntries( timeStart, timeEnd );

    // For all entries, let's get the mentions, and track the time spent for each, billable and non-billable
    if (entries) {
      entries.timeEntries.forEach(entry => {
        let mentionsTracked = false;
        const timeSpent = date.getDuration(entry.duration);
        entry.note.mentions.forEach(mention => {
          let mentionDetails = getMentions.details(mention.key);
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
      parsedReportOutput[mention] = parseFloat(
        reportOutput[mention].toFixed(2)
      );
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
  } catch (error) {
    console.log(error);
  }
};
