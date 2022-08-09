const entriesModal = require("../modals/entries");
const dateModal = require("../modals/date");

module.exports = async (startDate) => {
  try {
    const { timeStart, timeEnd } = dateModal.getRange(startDate);

    // Get all of the time entries that fit this range.
    const entries = await entriesModal.getEntries(timeStart, timeEnd);

    const reportData = [];
    let grandTotal = 0;
    let billableTotal = 0;
    let unknownTotal = 0;
    let nonBillableTotal = 0;

    // For all entries, let's get the mentions, and track the time spent for each, billable and non-billable
    if (entries) {
      entries.forEach((entry) => {
        let mentionsTracked = false;
        entry.note.mentions.forEach((mention) => {
          mentionsTracked = true;

          let label = "Missing Label";

          if (mention.details) {
            label = mention.details.label;
            billableTotal += entry.hoursSpent;
          } else {
            unknownTotal += entry.hoursSpent;
          }

          if (!reportData[label]) {
            reportData[label] = 0;
          }
          reportData[label] += entry.hoursSpent;
        });

        // No mentions, let's track this as "non-billable"
        if (!mentionsTracked) {
          nonBillableTotal += entry.hoursSpent;
        }
      });
    }

    // Calculate the grand total.
    grandTotal += billableTotal + nonBillableTotal;

    return {
      reportData,
      timeStart,
      timeEnd,
      billableTotal,
      unknownTotal,
      nonBillableTotal,
      grandTotal,
    };
  } catch (error) {
    console.log(error);
  }

  return false;
};
