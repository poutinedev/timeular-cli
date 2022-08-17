const expect = require("chai").expect;
const sinon = require("sinon");
const fs = require("fs");

const dataPath = __dirname + "/data/";

const getReportAction = require("../src/actions/get-report");
const timeularService = require("../src/services/timeular");

describe("Get Report", function() {
  let timeularMentions, timeularEntries;
  beforeEach(function() {
    timeularMentions = sinon
      .stub(timeularService, "getMentions")
      .callsFake(() => {
        const fileName = dataPath + "get-report.mentions.json";
        const fileContent = fs.readFileSync(fileName, "utf8");
        const parsedContent = JSON.parse(fileContent);

        return parsedContent.data.mentions;
      });

    timeularEntries = sinon
      .stub(timeularService, "getTimeEntries")
      .callsFake(function() {
        const fileName = dataPath + "get-report.time-entries.json";
        const fileContent = fs.readFileSync(fileName, "utf8");
        const parsedContent = JSON.parse(fileContent);

        return parsedContent.data;
      });
  });

  afterEach(function() {
    timeularMentions.restore();
    timeularEntries.restore();
  });

  it("should fail on invalid date", async function() {
    let result;
    try {
      result = await getReportAction("something");
    } catch (err) {
      // @TODO Do anything with this error? "Date must be YYYY-MM-DD format"
      result = false;
    }

    expect(result).to.equal(false);

    return true;
  });

  it("should succeed with a valid formatted date", async function() {
    const result = await getReportAction("2022-08-05");

    expect(result)
      .to.be.an("object")
      .that.has.all.keys(
        "reportData",
        "timeStart",
        "timeEnd",
        "billableTotal",
        "unknownTotal",
        "nonBillableTotal",
        "grandTotal"
      );

    expect(result.grandTotal.toFixed(2)).to.equal("10.04");
    return true;
  });
});
