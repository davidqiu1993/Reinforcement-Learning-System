/**
 * General require tool of the application.
 *
 * Author:  David Qiu.
 * Email:   david@davidqiu.com
 * Website: http://www.davidqiu.com/
 *
 * Copyright (C) 2015, David Qiu. All rights reserved.
 */

var drequire = function (module_name) {
  switch (module_name) {
    // MODULE: mathematics
    case 'maths':        return require('./lib/maths/index');
    case 'mathematics':  return drequire('maths');
    case 'math':         return drequire('maths');

    // MODULE: (not found)
    default:               return undefined;
  }
}


module.exports = drequire;
