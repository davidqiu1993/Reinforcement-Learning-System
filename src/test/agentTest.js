/**
 * Agent module testing.
 *
 * Author:  David Qiu.
 * Email:   david@davidqiu.com
 * Website: http://www.davidqiu.com/
 *
 * Copyright (C) 2015, David Qiu. All rights reserved.
 */

var Agent = drequire('Agent');


// SECTION: Agent module
describe('Agent', function () {
  // TEST: Type of the module
  it('should be a constructor function', function () {
    Agent.should.be.a.Function;
  });
});


// SECTION: Agent module instance
describe('Agent (instance)', function () {
  // Construct a corrent agent
  var _actions = ['E', 'W', 'N', 'S'];
  var _states  = ['(1,3)', '(2,3)', '(3,3)', '(4,3)',
                 '(1,2)', '(2,2)', '(3,2)', '(4,2)',
                 '(1,1)', '(2,1)', '(3,1)', '(4,1)'];
  var _discount_rate    = 0.5;
  var _acceptable_error = 1.0;
  var _agent = new Agent(_actions, _states, _discount_rate, _acceptable_error);

  // TEST: Existence of next function
  it('should have a next function', function () {
    _agent.next.should.be.a.Function;
  });

  // TEST: Constructor function
  it('should be constructed by its constructor function', function () {
    // Check the configurations
    _agent.actions.should.eql(_actions);
    _agent.states.should.eql(_states);
    _agent.discount_rate.should.equal(_discount_rate);
    _agent.acceptable_error.should.equal(_acceptable_error);

    // Check the probability distribution table
    _agent.$probabilities.should.be.ok;
    for(var i=0; i<_states.length; ++i) {
      _agent.$probabilities[_states[i]].should.be.ok;
      for(var j=0; j<_actions.length; ++j) {
        _agent.$probabilities[_states[i]][_actions[j]].should.be.ok;
        for(var k=0; k<_states.length; ++k) {
          _agent.$probabilities[_states[i]][_actions[j]][_states[k]].should.be.ok;
          _agent.$probabilities[_states[i]][_actions[j]][_states[k]].value.should.equal(1.0 / _states.length);
          _agent.$probabilities[_states[i]][_actions[j]][_states[k]].count.should.equal(0);
        }
      }
    }

    // Check the reward table
    _agent.$rewards.should.be.ok;
    for(var i=0; i<_states.length; ++i) {
      _agent.$rewards[_states[i]].should.be.ok;
      _agent.$rewards[_states[i]].value.should.equal(0);
      _agent.$rewards[_states[i]].count.should.equal(0);
    }

    // Check the value table
    _agent.$values.should.be.ok;
    for(var i=0; i<_states.length; ++i) {
      _agent.$values[_states[i]].should.be.ok;
      _agent.$values[_states[i]].value.should.equal(0);
    }
  });
});


