const getReportAction = require("../actions/get-report");

const getDateRangeForDisplay = (start) => {
  // @todo support date ranges larger than one day
  let string = start.format("MMMM Do, YYYY");

  return string;
};

const tableFormatting = (data) => {
  const response = [];
  for (const mention of Object.keys(data)) {
    // parseFloat here is just for visual purposes, so the console.table doesn't wrap it in a string.
    response[mention] = parseFloat(data[mention].toFixed(2));
  }

  return response;
};

module.exports = async (startDate) => {
  try {
    const data = await getReportAction(startDate);

    if (data) {
      // Output all of the information
      console.error(
        "Report for",
        getDateRangeForDisplay(data.timeStart, data.timeEnd)
      );

      if (data.grandTotal <= 0) {
        console.log("No time entries found");
        return;
      }

      // Format everything for display.
      const formattedData = tableFormatting(data.reportData);

      // @todo sort by key?

      // @todo add 'Other' time to table instead of it's own 'total' entry?

      console.table(formattedData);
      if (data.nonBillableTotal > 0) {
        console.log("Non-Billable : ", data.nonBillableTotal.toFixed(2));
      }
      if (data.billableTotal > 0) {
        console.log("Billable     : ", data.billableTotal.toFixed(2));
      }
      if (data.unknownTotal > 0) {
        console.log("Unknown      : ", data.unknownTotal.toFixed(2));
      }
      console.log("Total Hours  : ", data.grandTotal.toFixed(2));

      return true;
    }

    console.error("There was an error.");
  } catch (error) {
    console.error(error);
  }
};
