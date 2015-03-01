/**
 * Aritificial intelligence agent with general reinforcement learning
 * algorithm.
 *
 * Author:  David Qiu
 * Email:   david@davidqiu.com
 * Website: http://www.davidqiu.com/
 *
 * Copyright (C) 2015, David Qiu. All rights reserved.
 */

var maths = drequire('maths');
var algorithms = drequire('algorithms');
var nextAction = require('./nextAction');


/**
 * @param actions Collection of all possible actions.
 * @param states Collection of all possible states.
 * @param discount_rate Discount rate of state rewards in value function.
 * @param acceptable_error Acceptable error in value iteration.
 * @return An artificial intelligence agent of reinforcement learning system.
 *
 * @brief
 *    Constructor of the agent entity.
 */
var Agent = function (actions, states, discount_rate, acceptable_error) {
  // Check the parameters
  var paramCheck = true;
  if (!( typeof(actions) == 'array' || actions instanceof Array )) paramCheck = false;
  else {
    if (!( actions.length > 0 )) paramCheck = false;
    for (var i=0; i<actions.length; ++i) {
      if (!( typeof(actions[i]) == 'string' || actions[i] instanceof String ||
             typeof(actions[i]) == 'number' || actions[i] instanceof Number )) {
        paramCheck = false;
      }
    }
  }
  if (!( typeof(states) == 'array' || states instanceof Array )) paramCheck = false;
  else {
    if (!( states.length > 0 )) paramCheck = false;
    for(var i=0; i<states.length; ++i) {
      if (!( typeof(states[i]) == 'string' || states[i] instanceof String ||
             typeof(states[i]) == 'number' || states[i] instanceof Number )) {
        paramCheck = false;
      }
    }
  }
  if (!( typeof(discount_rate) == 'number' || discount_rate instanceof Number )) paramCheck = false;
  else {
    if (!( 0 <= discount_rate && discount_rate <= 1 )) paramCheck = false;
  }
  if (!( typeof(acceptable_error) == 'number' || acceptable_error instanceof Number )) paramCheck = false;
  else {
    if (!( 0 < acceptable_error )) paramCheck = false;
  }
  if (!paramCheck) {
    var err = new Error('Some of the parameters are invalid.');
    err.arguments = {
      actions:          actions,
      states:           states,
      discount_rate:    discount_rate,
      acceptable_error: acceptable_error
    };
    throw err;
  }

  // Initialize the configurations
  this.actions          = algorithms.removeRepeatElements(actions);
  this.states           = algorithms.removeRepeatElements(states);
  this.discount_rate    = discount_rate;
  this.acceptable_error = acceptable_error;

  // Initialize the probability distribution table
  this.$probabilities = {};
  for (var i=0; i<this.states.length; ++i) {
    this.$probabilities[this.states[i]] = [];
    for (var j=0; j<this.actions.length; ++j) {
      this.$probabilities[this.states[i]][this.actions[j]] = [];
      for (var k=0; k<this.states.length; ++k) {
        this.$probabilities[this.states[i]][this.actions[j]][this.states[k]] = {
          value: 1.0 / this.states.length,
          count: 0
        };
      }
    }
  }

  // Initialize the reward table
  this.$rewards = {};
  for(var i=0; i<this.states.length; ++i) {
    this.$rewards[this.states[i]] = {
      value: 0,
      count: 0
    };
  }

  // Initialize the value table
  this.$values = {};
  for(var i=0; i<this.states.length; ++i) {
    this.$values[this.states[i]] = {
      value: 0
    };
  }
}


/**
 * @param prev_state State of previous round.
 * @param prev_action Action of previous round.
 * @param cur_state State of current round.
 * @param cur_reward Reward of current round.
 * @return The action selected for current round by the agent.
 *
 * @brief
 *    Update the reinforcement learning algorithm statistics and compute the 
 *    next action selected by the current statistics and agent algorithm.
 */
Agent.prototype.next = function (prev_state, prev_action, cur_state, cur_reward) {
  return nextAction(
    this.actions, this.states, this.discount_rate, this.acceptable_error,
    this.$probabilities, this.$rewards, this.$values,
    prev_state, prev_action, cur_state, cur_reward
  );
}


module.exports = Agent;
