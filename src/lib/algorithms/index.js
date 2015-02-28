/**
 * Algorithms helper library.
 *
 * Author:  David Qiu
 * Email:   david@davidqiu.com
 * Website: http://www.davidqiu.com/
 *
 * Copyright (C) 2015, David Qiu. All rights reserved.
 */

var algorithms = {};


/**
 * @param arr The array to remove repeat elements from.
 * @return An array with all unique elements.
 *
 * @brief
 *    Remove all repeat elements in an array.
 */
algorithms.removeRepeatElements = function (arr) {
  var result = [];
  var hash = {};

  for (var i=0; i<arr.length; ++i) {
    if (!hash[arr[i]]) {
      result.push(arr[i]);
      hash[arr[i]] = true;
    }
  }

  return result;
}


module.exports = algorithms;
