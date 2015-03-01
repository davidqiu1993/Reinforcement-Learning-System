/**
 * Aritificial intelligence agent algorithm to update the probability 
 * distributions, state rewards and values, and calculate the next action in 
 * the optimal policy according to current statistics.
 *
 * Author:  David Qiu
 * Email:   david@davidqiu.com
 * Website: http://www.davidqiu.com/
 *
 * Copyright (C) 2015, David Qiu. All rights reserved.
 */

var maths = drequire('maths');

var nextAction = undefined;


/**
 * @param actions Collection of all possible actions.
 * @param states Collection of all possible states.
 * @param discount_rate Discount rate in reward function.
 * @param acceptable_error Acceptable error in value iteration.
 * @param $probabilities Transition probability distributions.
 * @param $rewards Rewards of the states.
 * @param $values Value of the states.
 * @param previous_state State of previous round.
 * @param previous_action Action of previous round.
 * @param current_state State of current round.
 * @param current_reward Reward of current round.
 * @return The action selected for current round by the agent.
 *
 * @brief
 *    Update the reinforcement learning probability distributions, state 
 *    rewards and values, and compute the next action selected by the current 
 *    statistics and agent algorithm.
 */
nextAction = function (
  actions, states, discount_rate, acceptable_error,
  $probabilities, $rewards, $values,
  previous_state, previous_action, current_state, current_reward
) {
  // Configurations
  var A = actions; // collection of all possible actions, A = [ a1, a2, ... ]
  var S = states;  // collection of all possible states, S = [ s1, s2, ... ]
  var g = discount_rate; // discount rate in reward function
  var e = acceptable_error; // acceptable error in value iteration

  // Knowledge
  var P = $probabilities; // transition probability from one state to another with an action, p = P[s][a][s2].value, n = P[s][a][s2].count
  var R = $rewards; // reward function results of the states, r = R[s].value, n = R[s].count
  var V = $values; // value function results of the states, v = V[s].value

  // Observation
  var s_prev = previous_state; // state of previous round
  var a_prev = previous_action; // action of previous round
  var s_cur  = current_state; // state of current round
  var r_cur  = current_reward; // reward of current round


  // Update probability distributions
  P[s_prev][a_prev][s_cur].count++;
  var total_count = 0;
  for (var i=0; i<S.length; ++i) {
    total_count += P[s_prev][a_prev][S[i]].count;
  }
  for (var i=0; i<S.length; ++i) {
    P[s_prev][a_prev][S[i]].value = P[s_prev][a_prev][S[i]].count / total_count;
  }

  // Update reward function
  R[s_cur].count++;
  R[s_cur].value = (R[s_cur].value * (R[s_cur].count - 1) + r_cur) / R[s_cur].count;

  // Update value function
  var max_error = e + 1;
  while (max_error > e) {
    max_error = 0;
    for (var i=0; i<S.length; ++i) {
      // Compute the next value of the state
      var next_v = R[S[i]] + g * maths.make_max(A, function (a) {
        return maths.sum(S, function (s2) {
          return (P[S[i]][a][s2].value * V[s2].value);
        }).value;
      }).value;

      // Check the maximum error
      max_error = maths.max([ max_error, maths.abs(next_v - V[S[i]].value).value ]).value;

      // Update the value of the state
      V[S[i]].value = next_v;
    }
  }

  // Find the next action with the optimal policy
  var a_cur = maths.make_max(A, function (a) {
    return maths.sum(S, function (s2) {
      return (P[s_cur][a][s2].value * V[s2].value);
    }).value;
  }).operand;

  // Return the action
  return a_cur;
}


module.exports = nextAction;
