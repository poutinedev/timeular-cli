const assert = require('chai').assert

describe('check if Mocha is configured', function() {
  describe('an Array is accessible', function() {
    it('out of bounds on item 4 is correct', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});