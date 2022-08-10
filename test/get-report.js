const expect = require("chai").expect;

const getReport = require("../src/actions/get-report");

describe("Get Report", function() {
  this.timeout(8000);

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
