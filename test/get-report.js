const expect = require("chai").expect;
var getReport = require("../src/get-report");

describe("Get Report", function() {
  it("should fail on invalid date", async function() {
    const result = await getReport("something");

    expect(result).to.equal(false);

    return true;
  });

  it("should succeed with a valid formatted date", async function() {
    const result = await getReport("2022-08-05");

    expect(result)
      .to.be.an("object")
      .that.has.all.keys(
        "reportOutput",
        "timeStart",
        "timeEnd",
        "billableTotal",
        "nonBillableTotal",
        "grandTotal"
      );

    return true;
  });
});
