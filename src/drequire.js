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
    // MODULE: Mathematics
    case 'maths':        return require('./lib/maths/index');
    case 'mathematics':  return drequire('maths');
    case 'math':         return drequire('maths');

    // MODULE: Algorithms
    case 'algorithms':   return require('./lib/algorithms/index');

    // MODULE: Agent
    case 'agent':        return require('./lib/agent/index');

    // MODULE: Simulator of two dimensional map simulation
    case 'simulator-2dmap': return require('./lib/simulator-2dmap/index');

    // MODULE: Applications
    case 'apps':         return require('./apps/index');

    // MODULE: (not found)
    default:               return undefined;
  }
}


module.exports = drequire;
