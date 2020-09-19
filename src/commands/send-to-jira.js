const date = require("../data/get-date");
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

    // Get all of the time entries that fit this range.
    const entries = await getEntries( timeStart, timeEnd );

    // For all entries, let's get the mentions, and track the time spent for each, billable and non-billable
    if (entries) {
      entries.forEach(entry => {
        console.log(entry);
      });
    }
    // Output all of the information
    console.log("Submission for ", getDateRangeForDisplay(timeStart, timeEnd), " complete");
  } catch (error) {
    console.log(error);
  }
};
