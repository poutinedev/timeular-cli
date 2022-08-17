const expect = require("chai").expect;
// const sinon = require("sinon");
// const fs = require("fs");

const cacheService = require("../src/services/cache");

describe("Cache Service", function() {
  // let fsExists, fsUnlink, fsReadFile, fsWriteFile, fsReadDir;
  // beforeEach(function() {
  //   fsExists = sinon.stub(fs, "existsSync").callsFake(function() {
  //     return true;
  //   });
  //   fsUnlink = sinon.stub(fs, "unlinkSync").callsFake(function() {
  //     return true;
  //   });
  //   fsReadFile = sinon.stub(fs, "readFileSync");
  //   fsWriteFile = sinon.stub(fs, "writeFileSync");
  //   fsReadDir = sinon.stub(fs, "readdir");
  // });

  // afterEach(function() {
  //   fsExists.restore();
  //   fsReadFile.restore();
  //   fsWriteFile.restore();
  //   fsReadDir.restore();
  //   fsUnlink.restore();
  // });

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

    return true;
  });

  it("should override successfully", async function() {
    const result = await cacheService.set("test", "testOverride");
    expect(result)
      .to.be.an("object")
      .that.has.all.keys("expiration", "data");

    return true;
  });

  it("should get successfully", async function() {
    // fsReadFile.callsFake(function() {
    //   return '{"expiration":"2022-08-17T01:52:52.973Z","data":"testOverride"}';
    // });

    const result = await cacheService.get("test");

    expect(result).to.equal("testOverride");

    return true;
  });

  it("should support objects", async function() {
    await cacheService.set("test", {
      message: "success",
      array: [1, 2, 3],
      bool: true,
    });

    // fsReadFile.callsFake(
    //   function() {
    //     return '{"expiration":"2022-08-17T01:53:54.865Z","data":{"message":"success","array":[1,2,3],"bool":true}}';
    //   }
    // );

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

    return true;
  });

  it("should support arrays", async function() {
    await cacheService.set("test", [1, 2, 3]);

    //  fsReadFile.callsFake(
    //    function() {
    //      return '{"expiration":"2022-08-17T01:54:55.565Z","data":[1,2,3]}';
    //    }
    //  );

    const result = await cacheService.get("test");

    expect(result)
      .to.be.an("array")
      .and.to.have.length(3)
      .and.to.include(2);

    return true;
  });

  it("should not return data on get due to expired content", async function() {
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() - 30);

    await cacheService.set("test", "testData", expiration);

    // fsReadFile.callsFake(
    //   function() {
    //     return '{"expiration":"2022-08-12T01:54:55.565Z","data":"test"}';
    //   }
    // );

    const result = await cacheService.get("test");

    expect(result)
      .to.be.a("boolean")
      .and.to.equal(false);

    return true;
  });
});

describe("Caching Clearing", function() {
  it("should clear successfully", async function() {
    const resultClear = await cacheService.clear("test");

    expect(resultClear)
      .to.be.an("boolean")
      .and.to.equal(true);

    return true;
  });

  it("should not find a file", async function() {
    const resultGet = await cacheService.get("test");

    expect(resultGet)
      .to.be.a("boolean")
      .and.to.equal(false);

    return true;
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

    return true;
  });
});
