/**
 * Mathematics helper library.
 *
 * Author:  David Qiu
 * Email:   david@davidqiu.com
 * Website: http://www.davidqiu.com/
 *
 * Copyright (C) 2015, David Qiu. All rights reserved.
 */

var maths = {};


/**
 * @param operands The array of all possible operands.
 * @param operator The operator for the operands. The form of the operator 
 *                 function is "function (operand)", which returns the value 
 *                 of the operator with the corresponding operand.
 * @return The maximum operation value and corresponding operand in the form 
 *         "{ value, operand }". The first operand the make up the maximum 
 *         value is selected if there are multiple operands that lead to the 
 *         maximum value.
 *
 * @brief
 *    Calculate the operator function with all possible operands, and select 
 *    the operand that maximizes the operator function. The operator value of 
 *    the selected operand serves as the value of this function.
 */
maths.make_max = function (operands, operator) {
  // Check the parameters
  var paramCheck = true;
  if (!( typeof(operands) == 'array' || operands instanceof Array )) paramCheck = false;
  else {
    if (!( operands.length > 0 )) paramCheck = false;
  }
  if (!( typeof(operator) == 'function' || operator instanceof Function )) paramCheck = false;
  if (!paramCheck) {
    var err = new Error('Some of the parameters are invalid.');
    err.arguments = { operands: operands, operator: operator };
    throw err;
  }

  // Define general variables
  var selected_operand = undefined;
  var max_value = undefined;

  // Find the maximum value and corresponding operand
  for (var i=0; i<operands.length; ++i) {
    // Check if it is the initial round
    if (selected_operand === undefined) {
      // Initialize the selected operand and maximum value
      selected_operand = operands[i];
      max_value = operator(operands[i]);
    } else {
      // Calculate the current value
      var cur_value = operator(operands[i]);

      // Check if it is the maximum value
      if (cur_value > max_value) {
        // Update the maximum value and selected operand
        max_value = cur_value;
        selected_operand = operands[i];
      }
    }
  }

  // Return the maximum value and corresponding operand
  return { value: max_value, operand: selected_operand };
}


/**
 * @param operands The array of operand items for the sum operator.
 * @param operator The sum operator. The form of the operator function is 
 *                 "function (operand)", which returns the value of the 
 *                 operator function.
 * @return The result of the sum function in the form "{ value }".
 *
 * @brief
 *    Calculate the operator sum of the operands.
 */
maths.sum = function (operands, operator) {
  // Check the parameters
  var paramCheck = true;
  if (!( typeof(operands) == 'array' || operands instanceof Array )) paramCheck = false;
  else {
    if (!( operands.length >= 0 )) paramCheck = false;
  }
  if (!( typeof(operator) == 'function' || operator instanceof Function )) paramCheck = false;
  if (!paramCheck) {
    var err = new Error('Some of the parameters are invalid.');
    err.arguments = { operands: operands, operator: operator };
    throw err;
  }

  // Define general variables
  var sum_value = 0;

  // Calculate the sum value
  for (var i=0; i<operands.length; ++i) {
    sum_value += operator(operands[i]);
  }

  // Return the sum value
  return { value: sum_value };
}


/**
 * @param operands The array of all operands.
 * @return The maximum value among the operands in the form "{ value }".
 *
 * @brief
 *    Find the maximum value among the operands.
 */
maths.max = function (operands) {
  // Check the parameters
  var paramCheck = true;
  if (!( typeof(operands) == 'array' || operands instanceof Array )) paramCheck = false;
  else if (!( operands.length > 0 )) paramCheck = false;
  else {
    for (var i=0; i<operands.length; ++i) {
      if (!( typeof(operands[i]) == 'number' || operands[i] instanceof Number )) paramCheck = false;
    }
  }
  if (!paramCheck) {
    var err = new Error('Some of the parameters are invalid.');
    err.arguments = { operands: operands};
    throw err;
  }

  // Define general variables
  var max_value = undefined;

  // Find the maximum value
  for (var i=0; i<operands.length; ++i) {
    // Check if it is the initial round
    if (max_value === undefined) {
      // Initialize the maximum value
      max_value = operands[i];
    } else {
      // Check the maximum value
      if (operands[i] > max_value) max_value = operands[i];
    }
  }

  // Return the maximum value
  return { value: max_value };
}


/**
 * @param operands The array of all operands.
 * @return The minimum value among the operands in the form "{ value }".
 *
 * @brief
 *    Find the minimum value among the operands.
 */
maths.min = function (operands) {
  // Check the parameters
  var paramCheck = true;
  if (!( typeof(operands) == 'array' || operands instanceof Array )) paramCheck = false;
  else if (!( operands.length > 0 )) paramCheck = false;
  else {
    for (var i=0; i<operands.length; ++i) {
      if (!( typeof(operands[i]) == 'number' || operands[i] instanceof Number )) paramCheck = false;
    }
  }
  if (!paramCheck) {
    var err = new Error('Some of the parameters are invalid.');
    err.arguments = { operands: operands };
    throw err;
  }

  // Define general variables
  var min_value = undefined;

  // Find the minimum value
  for (var i=0; i<operands.length; ++i) {
    // Check if it is the initial round
    if (min_value === undefined) {
      // Initialize the minimum value
      min_value = operands[i];
    } else {
      // Check the minimum value
      if (operands[i] < min_value) min_value = operands[i];
    }
  }

  // Return the minimum value
  return { value: min_value };
}


/**
 * @param operand The operand of the function.
 * @return The absolute value of the operand in the form "{ value }".
 *
 * @brief
 *    Calculate the absolute value of the operand.
 */
maths.abs = function (operand) {
  return { value: Math.abs(operand) };
}


module.exports = maths;
