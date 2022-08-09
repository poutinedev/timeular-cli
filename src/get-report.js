const entriesModal = require("./modals/entries");
const dateModal = require("./modals/date");

module.exports = async (startDate) => {
  try {
    const { timeStart, timeEnd } = dateModal.getRange(startDate);

    // Get all of the time entries that fit this range.
    const entries = await entriesModal.getEntries(timeStart, timeEnd);

    const reportOutput = [];
    let grandTotal = 0;
    let billableTotal = 0;
    let nonBillableTotal = 0;

    // For all entries, let's get the mentions, and track the time spent for each, billable and non-billable
    if (entries) {
      entries.forEach((entry) => {
        let mentionsTracked = false;
        entry.note.mentions.forEach((mention) => {
          if (!reportOutput[mention.details.label]) {
            reportOutput[mention.details.label] = 0;
          }

          mentionsTracked = true;
          reportOutput[mention.details.label] += entry.hoursSpent;
          billableTotal += entry.hoursSpent;
        });

        // No mentions, let's track this as "non-billable"
        if (!mentionsTracked) {
          nonBillableTotal += entry.hoursSpent;
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

    return {
      reportOutput,
      timeStart,
      timeEnd,
      billableTotal,
      nonBillableTotal,
      grandTotal,
    };
  } catch (error) {
    console.log(error);
  }

  return false;
  // try {
  //   // Gets the date range based on settings and user input
  //   const { timeStart, timeEnd } = date.getRange(startDate);

  //   const reportOutput = [];
  //   let grandTotal = 0;
  //   let billableTotal = 0;
  //   let nonBillableTotal = 0;

  //   // Get all of the time entries that fit this range.
  //   const entries = await getEntries( timeStart, timeEnd );

  //   // For all entries, let's get the mentions, and track the time spent for each, billable and non-billable
  //   if (entries) {
  //     entries.forEach(entry => {
  //       let mentionsTracked = false;
  //       entry.note.mentions.forEach(mention => {
  //         if (!reportOutput[mention.details.label]) {
  //           reportOutput[mention.details.label] = 0;
  //         }

  //         mentionsTracked = true;
  //         reportOutput[mention.details.label] += entry.hoursSpent;
  //         billableTotal += entry.hoursSpent;
  //       });

  //       // No mentions, let's track this as "non-billable"
  //       if (!mentionsTracked) {
  //         nonBillableTotal += entry.hoursSpent;
  //       }
  //     });
  //   }

  //   // Format everything for display.
  //   const parsedReportOutput = [];
  //   for (const mention of Object.keys(reportOutput)) {
  //     // parseFloat here is just for visual purposes, so the console.table doesn't wrap it in a string.
  //     parsedReportOutput[mention] = parseFloat(
  //       reportOutput[mention].toFixed(2)
  //     );
  //   }
  //   // @todo sort by key?

  //   // @todo add 'Other' time to table instead of it's own 'total' entry?

  //   // Calculate the grand total.
  //   grandTotal += billableTotal + nonBillableTotal;

  //   // Output all of the information
  //   console.log("Report for", getDateRangeForDisplay(timeStart, timeEnd));
  //   console.table(parsedReportOutput);
  //   console.log("Non-Billable : ", nonBillableTotal.toFixed(2));
  //   console.log("Billable     : ", billableTotal.toFixed(2));
  //   console.log("Total Hours  : ", grandTotal.toFixed(2));
  // } catch (error) {
  //   console.log(error);
  // }
};
