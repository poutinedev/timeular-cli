const expect = require("chai").expect;

var cacheService = require("../src/services/cache");

describe("Cache Service", function() {
  it("should have all required functions", function() {
    expect(cacheService)
      .to.be.an("object")
      .that.has.all.keys("get", "set", "clear", "clearAll");
  });

  it("should set successfully", async function() {
    const result = await cacheService.set("test", "testData");
    expect(result)
      .to.be.an("object")
      .that.has.all.keys("expiration", "data");
  });

  it("should override successfully", async function() {
    const result = await cacheService.set("test", "testOverride");
    expect(result)
      .to.be.an("object")
      .that.has.all.keys("expiration", "data");
  });

  it("should get successfully", async function() {
    const result = await cacheService.get("test");

    expect(result).to.equal("testOverride");
  });

  it("should support objects", async function() {
    await cacheService.set("test", {
      message: "success",
      array: [1, 2, 3],
      bool: true,
    });

    const result = await cacheService.get("test");

    expect(result)
      .to.be.an("object")
      .that.has.all.keys("message", "array", "bool");

    expect(result.message)
      .to.be.a("string")
      .and.to.equal("success");

    expect(result.array)
      .to.be.an("array")
      .and.to.have.length(3)
      .and.to.include(2);

    expect(result.bool)
      .to.be.a("boolean")
      .and.to.equal(true);
  });

  it("should support arrays", async function() {
    await cacheService.set("test", [1, 2, 3]);

    const result = await cacheService.get("test");

    expect(result)
      .to.be.an("array")
      .and.to.have.length(3)
      .and.to.include(2);
  });

  it("should not return data on get due to expired content", async function() {
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() - 30);

    await cacheService.set("test", "testData", expiration);

    const result = await cacheService.get("test");

    expect(result)
      .to.be.a("boolean")
      .and.to.equal(false);
  });

  it("should clear successfully", async function() {
    const resultClear = await cacheService.clear("test");

    expect(resultClear)
      .to.be.an("boolean")
      .and.to.equal(true);

    const resultGet = await cacheService.get("test");

    expect(resultGet)
      .to.be.a("boolean")
      .and.to.equal(false);
  });

  it("should flush all files successfully", async function() {
    await cacheService.set("test1", "test1");
    await cacheService.set("test2", "test2");
    await cacheService.set("test3", "test3");
    await cacheService.set("test4", "test4");

    const result = await cacheService.clearAll();

    expect(result)
      .to.be.a("boolean")
      .and.to.equal(true);
  });
});
