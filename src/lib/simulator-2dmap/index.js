/**
 * External environment simulator of two-dimensional map simulation for 
 * general reinforcement learning agent.
 *
 * Author:  David Qiu
 * Email:   david@davidqiu.com
 * Website: http://www.davidqiu.com/
 *
 * Copyright (C) 2015, David Qiu. All rights reserved.
 */

var maths = drequire('maths');

var _helper = {};


/**
 * @param dist_E Sensed obstacle distence of the East IR sensor.
 * @param dist_S Sensed obstacle distence of the South IR sensor.
 * @param dist_W Sensed obstacle distence of the West IR sensor.
 * @param dist_N Sensed obstacle distence of the North IR sensor.
 * @return The state string constructed from the sensor data.
 *
 * @brief
 *    Convert IR sensor data to state string.
 */
_helper.convertIRToState = function (dist_E, dist_S, dist_W, dist_N) {
  var stateString = '(' + dist_E + ',' +
                          dist_S + ',' +
                          dist_W + ',' +
                          dist_N + ')';
  return stateString;
}

/**
 * @param map The two-dimensional array indicating the map of simulation.
 * @param ir_cap The capability of the IR sensors.
 * @param pos_x The initial x-axis position.
 * @param pos_y The initial y-axis position.
 * @return The IR sensor distences vector in the form "{ dist_E, dist_S, 
 *         dist_W, dist_N }".
 *
 * @brief
 *    Calculate the IR sensor distences.
 */
_helper.calculateIRDistences = function (map, ir_cap, pos_x, pos_y) {
  // Check the parameters
  var paramCheck = true;
  if (!( typeof(map) == 'array' || map instanceof Array )) paramCheck = false;
  else if (!( map.length > 0 )) paramCheck = false;
  else {
    for (var i=0; i<map.length; ++i) {
      if (!( typeof(map[i]) == 'array' || map[i] instanceof Array )) {
        paramCheck = false;
        break;
      } else if (!( map[i].length > 0 && map[i].length == map[0].length )) {
        paramCheck = false;
        break;
      } else {
        for (var j=0; j<map[i].length; ++j) {
          if (!( map[i][j] == 'O' || map[i][j] == 'X' )) {
            paramCheck = false;
            break;
          }
        }
      }
      if (!paramCheck) break;
    }
  }
  if (!( typeof(ir_cap) == 'number' || ir_cap instanceof Number )) paramCheck = false;
  else {
    ir_cap = Math.floor(ir_cap);
    if (!( ir_cap > 0 )) paramCheck = false;
  }
  if (!( typeof(pos_x) == 'number' || pos_x instanceof Number )) paramCheck = false;
  else {
    if (!( pos_x < map.length )) paramCheck = false;
  }
  if (!( typeof(pos_y) == 'number' || pos_y instanceof Number )) paramCheck = false;
  else {
    if (!( pos_y < map[0].length )) paramCheck = false;
  }
  if (paramCheck) {
    if (!( map[pos_x][pos_y] == 'O' )) paramCheck = false;
  }
  if (!paramCheck) {
    var err = new Error('Some of the parameters are invalid.');
    err.arguments = { map: map, pos_x: pos_x, pos_y: pos_y, ir_cap: ir_cap };
    throw err;
  }

  // Define general variables
  var map_size = {
    width:  map.length,
    height: map[0].length
  };
  var dist_E = undefined;
  var dist_S = undefined;
  var dist_W = undefined;
  var dist_N = undefined;

  // Calculate the distence of IR sensor
  for (var ir_mapping=0; ir_mapping<4; ++ir_mapping) {
    var ir_pos_x = pos_x;
    var ir_pos_y = pos_y;
    var increment_count = 0;
    while (true) {
      // Increase the direction index
      ++increment_count;
      switch (ir_mapping) {
        case 0: ir_pos_x++; break;
        case 1: ir_pos_y--; break;
        case 2: ir_pos_x--; break;
        case 3: ir_pos_y++; break;
        default:
          var err = new Error('The IR sensor mapping is invalid.');
          err.arguments = { ir_mapping: ir_mapping };
          throw err;
      }

      // Detect map boundary
      if (!( 0 <= ir_pos_x && ir_pos_x < map_size.width )) break;
      if (!( 0 <= ir_pos_y && ir_pos_y < map_size.height )) break;

      // Detect obstacle
      if (!( map[ir_pos_x][ir_pos_y] == 'X' )) break;
      else if (!( map[ir_pos_x][ir_pos_y] == 'O' )) {
        var err = new Error('The map is invalid.');
        err.arguments = { map: map };
        throw err;
      }
    }

    // Update IR sensor distences
    switch (ir_mapping) {
      case 0: dist_E = maths.min([increment_count, ir_cap]); break;
      case 1: dist_S = maths.min([increment_count, ir_cap]); break;
      case 2: dist_W = maths.min([increment_count, ir_cap]); break;
      case 3: dist_N = maths.min([increment_count, ir_cap]); break;
      default:
        var err = new Error('The IR sensor mapping is invalid.');
        err.arguments = { ir_mapping: ir_mapping };
        throw err;
    }
  }

  // Return the IR distences vector
  return { dist_E: dist_E, dist_S: dist_S, dist_W: dist_W, dist_N: dist_N };
}


/**
 * @param map The two-dimensional array indicating the map of simulation. It 
 *            must have the same number of items in raws or columns. The char 
 *            "O" indicates available path, and "X" indicates obstacle. The 
 *            first dimension indicates the x-axis position from left to right 
 *            and the second one indicates the y-axis position from bottom to 
 *            top.
 * @param ir_cap The capability of the IR sensors. The minimum capability is 1 
 *               and the increment step is 1.
 * @param pos_x The initial x-axis position of the agent beginning from 0.
 * @param pos_y The initial y-axis position of the agent beginning from 0.
 * @return A simulator instance of two-dimensional map simulation.
 *
 * @brief
 *    Constructor of simulator of two-dimensional map simulation.
 */
var Simulator = function (map, ir_cap, pos_x, pos_y) {
  // Check the parameters
  var paramCheck = true;
  if (!( typeof(map) == 'array' || map instanceof Array )) paramCheck = false;
  else if (!( map.length > 0 )) paramCheck = false;
  else {
    for (var i=0; i<map.length; ++i) {
      if (!( typeof(map[i]) == 'array' || map[i] instanceof Array )) {
        paramCheck = false;
        break;
      } else if (!( map[i].length > 0 && map[i].length == map[0].length )) {
        paramCheck = false;
        break;
      } else {
        for (var j=0; j<map[i].length; ++j) {
          if (!( map[i][j] == 'O' || map[i][j] == 'X' )) {
            paramCheck = false;
            break;
          }
        }
      }
      if (!paramCheck) break;
    }
  }
  if (!( typeof(ir_cap) == 'number' || ir_cap instanceof Number )) paramCheck = false;
  else {
    ir_cap = Math.floor(ir_cap);
    if (!( ir_cap > 0 )) paramCheck = false;
  }
  if (!( typeof(pos_x) == 'number' || pos_x instanceof Number )) paramCheck = false;
  else {
    if (!( pos_x < map.length )) paramCheck = false;
  }
  if (!( typeof(pos_y) == 'number' || pos_y instanceof Number )) paramCheck = false;
  else {
    if (!( pos_y < map[0].length )) paramCheck = false;
  }
  if (paramCheck) {
    if (!( map[pos_x][pos_y] == 'O' )) paramCheck = false;
  }
  if (!paramCheck) {
    var err = new Error('Some of the parameters are invalid.');
    err.arguments = { map: map, ir_cap: ir_cap };
    throw err;
  }

  // Initialize environment information
  this.map = map;
  this.map_size = {
    width:  map.length,
    height: map[0].length
  };

  // Initialize agent information
  this.pos_x = pos_x;
  this.pos_y = pos_y;
  this.ir_cap = ir_cap;
  this.actions = ['E', 'W', 'S', 'N'];
  this.states = [];
  for (var i=1; i<=ir_cap; ++i) {
    for (var j=1; j<=ir_cap; ++j) {
      for (var k=1; k<=ir_cap; ++k) {
        for (var l=1; l<=ir_cap; ++l) {
          this.states.push(_helper.convertIRToState(i, j, k, l));
        }
      }
    }
  }

  
  /**
   * @param tf_map The two-dimensional map of the transition function.
   * @param tf_pos_x The x-axis position before the transition.
   * @param tf_pos_y The y-axis position before the transition.
   * @param tf_action The action of the transition.
   * @return The position after the transition in the form "{ pos_x, pos_y }".
   *
   * @brief
   *    The transition function of the simulator.
   */
  this.transition = function (tf_map, tf_pos_x, tf_pos_y, tf_action) {
    // Check the parameters
    var paramCheck = true;
    if (!( typeof(tf_map) == 'array' || tf_map instanceof Array )) paramCheck = false;
    else if (!( tf_map.length > 0 )) paramCheck = false;
    else {
      for (var i=0; i<tf_map.length; ++i) {
        if (!( typeof(tf_map[i]) == 'array' || tf_map[i] instanceof Array )) {
          paramCheck = false;
          break;
        } else if (!( tf_map[i].length > 0 && tf_map[i].length == tf_map[0].length )) {
          paramCheck = false;
          break;
        } else {
          for (var j=0; j<tf_map[i].length; ++j) {
            if (!( tf_map[i][j] == 'O' || tf_map[i][j] == 'X' )) {
              paramCheck = false;
              break;
            }
          }
        }
        if (!paramCheck) break;
      }
    }
    if (!( typeof(tf_pos_x) == 'number' || tf_pos_x instanceof Number )) paramCheck = false;
    else {
      if (!( tf_pos_x < tf_map.length )) paramCheck = false;
    }
    if (!( typeof(tf_pos_y) == 'number' || tf_pos_y instanceof Number )) paramCheck = false;
    else {
      if (!( tf_pos_y < tf_map[0].length )) paramCheck = false;
    }
    if (paramCheck) {
      if (!( tf_map[tf_pos_x][tf_pos_y] == 'O' )) paramCheck = false;
    }
    if (!( tf_action == 'E' || tf_action == 'W' || tf_action == 'S' || tf_action == 'N' )) {
      paramCheck = false;
    }
    if (!paramCheck) {
      var err = new Error('Some of the parameters are invalid.');
      err.arguments = {
        tf_map:    tf_map,
        tf_pos_x:  tf_pos_x,
        tf_pos_y:  tf_pos_y,
        tf_action: tf_action
      };
      throw err;
    }

    // Calculate the map size
    var tf_map_size = {
      width:  tf_map.length,
      height: tf_map[0].length
    };

    // Map the action
    var action_mapping = undefined;
    switch (tf_action) {
      case 'E': action_mapping = 0; break;
      case 'S': action_mapping = 1; break;
      case 'W': action_mapping = 2; break;
      case 'N': action_mapping = 3; break;
      default:
        var err = new Error('The action is invalid.');
        err.arguments = { tf_action: tf_action };
        throw err;
    }

    // Calculate the actual action
    var next_drop = Math.random();
    if (0 <= next_drop && next_drop < 0.1) {
      action_mapping = action_mapping - 1;
    } else if (0.1 <= next_drop && next_drop < 0.2) {
      action_mapping = action_mapping + 1;
    } else {
      action_mapping = action_mapping;
    }

    // Fix the action mapping range
    action_mapping = (action_mapping + 4) % 4;

    // Calculate the next position
    var next_pos_x = tf_pos_x;
    var next_pos_y = tf_pos_y;
    switch (action_mapping) {
      case '0': ++next_pos_x; break;
      case '1': --next_pos_y; break;
      case '2': --next_pos_x; break;
      case '3': ++next_pos_y; break;
      default:
        var err = new Error('The action mapping is invalid.');
        err.arguments = { action_mapping: action_mapping };
        throw err;
    }

    // Detect map boundary
    var detectBoundary = true;
    if (!( 0 <= next_pos_x && next_pos_x < tf_map_size.width )) detectBoundary = false;
    if (!( 0 <= next_pos_y && next_pos_y < tf_map_size.height )) detectBoundary = false;

    // Detect obstacle collision
    var detectCollision = true;
    if (!( tf_map[next_pos_x][next_pos_y] == 'O' )) detectCollision = false;

    // Check detection and return the transition result
    var transition_result = {
      pos_x: next_pos_x,
      pos_y: next_pos_y
    };
    if (!( detectBoundary && detectCollision )) {
      transition_result = {
        pos_x: tf_pos_x,
        pos_y: tf_pos_y
      };
    };
    return transition_result;
  }


  /**
   * @param rf_map The two-dimensional map of the simulation.
   * @param rf_ir_cap The IR sensor capability.
   * @param rf_pos_x The x-axis position of the reward point.
   * @param rf_pos_y The y-axis position of the reward point.
   * @param rf_action The action of the transition to this position.
   * @return The environment state reward of the simulation.
   *
   * @brief
   *    The reward function of the simulation
   */
  this.reward = function (rf_map, rf_ir_cap, rf_pos_x, rf_pos_y, rf_action) {
    // Check the parameters
    var paramCheck = true;
    if (!( typeof(rf_map) == 'array' || rf_map instanceof Array )) paramCheck = false;
    else if (!( rf_map.length > 0 )) paramCheck = false;
    else {
      for (var i=0; i<rf_map.length; ++i) {
        if (!( typeof(rf_map[i]) == 'array' || rf_map[i] instanceof Array )) {
          paramCheck = false;
          break;
        } else if (!( rf_map[i].length > 0 && rf_map[i].length == rf_map[0].length )) {
          paramCheck = false;
          break;
        } else {
          for (var j=0; j<rf_map[i].length; ++j) {
            if (!( rf_map[i][j] == 'O' || rf_map[i][j] == 'X' )) {
              paramCheck = false;
              break;
            }
          }
        }
        if (!paramCheck) break;
      }
    }
    if (!( typeof(rf_ir_cap) == 'number' || rf_ir_cap instanceof Number )) paramCheck = false;
    else {
      rf_ir_cap = Math.floor(rf_ir_cap);
      if (!( rf_ir_cap > 0 )) paramCheck = false;
    }
    if (!( typeof(rf_pos_x) == 'number' || rf_pos_x instanceof Number )) paramCheck = false;
    else {
      if (!( rf_pos_x < rf_map.length )) paramCheck = false;
    }
    if (!( typeof(rf_pos_y) == 'number' || rf_pos_y instanceof Number )) paramCheck = false;
    else {
      if (!( rf_pos_y < rf_map[0].length )) paramCheck = false;
    }
    if (paramCheck) {
      if (!( rf_map[rf_pos_x][rf_pos_y] == 'O' )) paramCheck = false;
    }
    if (!( rf_action == 'E' || rf_action == 'W' || rf_action == 'S' || rf_action == 'N' )) {
      paramCheck = false;
    }
    if (!paramCheck) {
      var err = new Error('Some of the parameters are invalid.');
      err.arguments = {
        rf_map:    rf_map,
        rf_ir_cap: rf_ir_cap,
        rf_pos_x:  rf_pos_x,
        rf_pos_y:  rf_pos_y,
        rf_action: rf_action
      };
      throw err;
    }

    // Calculate the minimum IR distence
    var ir_distences = _helper.calculateIRDistences(
      rf_map,
      rf_ir_cap,
      rf_pos_x,
      rf_pos_y
    );
    var min_ir_distence = maths.min([
      ir_distences.dist_E,
      ir_distences.dist_S,
      ir_distences.dist_W,
      ir_distences.dist_N
    ]);

    // Return the reward
    return min_ir_distence;
  }
}


/**
 * @return The agent state string of the current simulation status.
 *
 * @brief
 *    Get the current state of the agent.
 */
Simulator.prototype.getState = function () {
  // Calculate the IR sensor distences of the current simulation status
  var ir_distences = _helper.calculateIRDistences(
    this.map,
    this.ir_cap,
    this.pos_x,
    this.pos_y
  );

  // Convert the IR sensor distences to state string
  var state_string = _helper.convertIRToState(
    ir_distences.dist_E,
    ir_distences.dist_S,
    ir_distences.dist_W,
    ir_distences.dist_N
  );

  // Return the state string
  return state_string;
}


/**
 * @param action The action of the transition.
 * @return The next state and reward after the transition of the simulation 
 *         in the form "{ state, result }".
 *
 * @brief
 *    Translate to the next position with the action, and calculate the state 
 *    and reward of the state.
 */
Simulator.prototype.next = function (action) {
  // Check the parameters
  if (!( action == 'E' || action == 'W' || action == 'S' || action == 'N' )) {
    paramCheck = false;
  }
  if (!paramCheck) {
    var err = new Error('Some of the parameters are invalid.');
    err.arguments = { action: action };
    throw err;
  }

  // Calculate the transition result
  var transition_result = this.transition(this.map, this.pos_x, this.pos_y, action);

  // Update the simulator status
  this.pos_x = transition_result.pos_x;
  this.pos_y = transition_result.pos_y;

  // Calculate the IR sensor distences of the current simulation status
  var ir_distences = _helper.calculateIRDistences(
    this.map,
    this.ir_cap,
    this.pos_x,
    this.pos_y
  );

  // Convert the IR sensor distences to state string
  var state_string = _helper.convertIRToState(
    ir_distences.dist_E,
    ir_distences.dist_S,
    ir_distences.dist_W,
    ir_distences.dist_N
  );

  // Calculate the reward result
  var reward_result = this.reward(
    this.map,
    this.ir_cap,
    this.pos_x,
    this.pos_y,
    action
  );

  // Return the next state and reward
  return { state: state_string, reward: reward_result };
};


module.exports = Simulator;
