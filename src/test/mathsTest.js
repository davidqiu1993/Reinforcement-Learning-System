/**
 * Mathematics module testing.
 *
 * Author:  David Qiu.
 * Email:   david@davidqiu.com
 * Website: http://www.davidqiu.com/
 *
 * Copyright (C) 2014, David Qiu. All rights reserved.
 */

var maths = drequire('maths');


// SECTION: Mathematics module
describe('maths', function() {
  // TEST: Existence of make_max function
  it('should have make_max function', function() {
    maths.make_max.should.be.a.Function;
  });

  // TEST: Existence of sum function
  it('should have sum function', function() {
    maths.sum.should.be.a.Function;
  });

  // TEST: Existence of max function
  it('should have max function', function() {
    maths.max.should.be.a.Function;
  });

  // TEST: Existence of min function
  it('should have min function', function() {
    maths.min.should.be.a.Function;
  });

  // TEST: Existence of abs function
  it('should have abs function', function() {
    maths.abs.should.be.a.Function;
  });


  // SECTION: Function make_max
  describe('.make_max', function () {
    // TEST: Operation with 3 operands
    it('should lead to the maximum value of an operator among 3 operands', function () {
      // Define the operands and operator
      var operands = [-2, 1, 3];
      var operator = function (x) {
        return -(x * x);
      }

      // Perform the operation
      var res = maths.make_max(operands, operator);

      // Check the result
      res.operand.should.equal(1);
      res.value.should.equal(-(1*1));
    });
  });


  // SECTION: Function sum
  describe('.sum', function () {
    // TEST: Operation with 3 operands
    it('should lead to the value sum of the operator with 3 operands', function () {
      // Define the operands and operator
      var operands = [1, 2, 3];
      var operator = function (x) {
        return (x * x);
      }

      // Perform the operation
      var res = maths.sum(operands, operator);

      // Check the result
      res.value.should.equal(1*1 + 2*2 + 3*3);
    });
  });


  // SECTION: Function max
  describe('.max', function () {
    // TEST: Operation with 3 operands
    it('should lead to the maximum value among 3 operands', function () {
      maths.max([-2, 10, 8]).value.should.equal(10);
    });
  });


  // SECTION: Function min
  describe('.min', function () {
    // TEST: Operation with 3 operands
    it('should lead to the minimum value among 3 operands', function () {
      maths.min([-2, -10, -8]).value.should.equal(-10);
    });
  });


  // SECTION: Function abs
  describe('.abs', function () {
    // TEST: Operation with positive number
    it('should lead to the absolute value of a positive number', function () {
      maths.abs(12).value.should.equal(12);
    });

    // TEST: Operation with negative number
    it('should lead to the absolute value of a negative number', function () {
      maths.abs(-127).value.should.equal(127);
    });

    // TEST: Operation with zero
    it('should lead to the absolute value of zero', function () {
      maths.abs(0).value.should.equal(0);
    });
  });
});


