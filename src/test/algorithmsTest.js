/**
 * Algorithms module testing.
 *
 * Author:  David Qiu.
 * Email:   david@davidqiu.com
 * Website: http://www.davidqiu.com/
 *
 * Copyright (C) 2014, David Qiu. All rights reserved.
 */

var algorithms = drequire('algorithms');


// SECTION: Algorithms module
describe('algorithms', function() {
  // TEST: Existence of removeRepeatElements function
  it('should have removeRepeatElements function', function() {
    algorithms.removeRepeatElements.should.be.a.Function;
  });


  // SECTION: Function removeRepeatElements
  describe('.removeRepeatElements', function () {
    // TEST: Array with no element
    it('should be able to process an array with no element', function () {
      algorithms.removeRepeatElements([]).should.eql([]);
    });

    // TEST: Array with unique elements
    it('should be able to process an array with unique elements', function () {
      algorithms.removeRepeatElements([2,1,3]).should.eql([2,1,3]);
    });

    // TEST: Array with some repeat elements
    it('should be able to remove repeat elements', function () {
      algorithms.removeRepeatElements([2,2,3,1,4,4,3]).should.eql([2,3,1,4]);
    });
  });
});


