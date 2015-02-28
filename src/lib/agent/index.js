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
    actions.forEach(function (item) {
      if (!( typeof(item) == 'string' || item instanceof String ||
             typeof(item) == 'number' || item instanceof Number )) {
        paramCheck = false;
      }
    });
  }
  if (!( typeof(states) == 'array' || states instanceof Array )) paramCheck = false;
  else {
    if (!( states.length > 0 )) paramCheck = false;
    states.forEach(function (item) {
      if (!( typeof(item) == 'string' || item instanceof String ||
             typeof(item) == 'number' || item instanceof Number )) {
        paramCheck = false;
      }
    });
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
  var initial_probability = {
    value: 1.0 / this.states.length,
    count: 0
  };
  this.$probabilities = [];
  this.states.forEach(function (state_a) {
    this.$probabilities[state_a] = [];
    this.actions.forEach(function (action_a) {
      this.$probabilities[state_a][action_a] = [];
      this.states.forEach(function (state_b) {
        this.$probabilities[state_a][action_a][state_b] = initial_probability;
      });
    });
  });

  // Initialize the reward table
  var initial_reward = {
    value: 0,
    count: 0
  };
  this.$rewards = [];
  this.states.forEach(function (state_a) {
    this.$rewards[state_a] = initial_reward;
  });

  // Initialize the value table
  var initial_value = {
    value: 0
  }
  this.$values = [];
  this.states.forEach(function (state_a) {
    this.$values[state_a] = initial_value;
  });
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
