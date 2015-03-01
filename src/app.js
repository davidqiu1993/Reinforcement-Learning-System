/**
 * General reinforcement learning system.
 *
 * Author:  David Qiu
 * Email:   david@davidqiu.com
 * Website: http://www.davidqiu.com/
 *
 * Copyright (C) 2015, David Qiu. All rights reserved.
 */

drequire = require('./drequire');

var AgentEntity = drequire('Agent');
var readline = require('readline');

var app = {};
var _helper = {};


_helper.nextToken = function (str) {
  var split = ' ';
  var trimStr = str.trim();
  var idx = trimStr.indexOf(split);
  if (idx == -1) {
    return { token: trimStr, rest: '' };
  }
  var token = trimStr.substr(0, idx);
  var restIdx = idx + split.length;
  var rest = trimStr.substr(restIdx, trimStr.length - restIdx);
  return { token: token.trim(), rest: rest.trim() };
}


app.showAgent = function () {
  console.log('========== [ Statistics ] ==========');
  console.log(app.agent);
  console.log('====================================');
}


app.next = function (paramLine) {
  var paramCheck = true;
  var parse_token = _helper.nextToken(paramLine);
  if (!parse_token.token) paramCheck = false;
  app.cur_state = parse_token.token;
  parse_token = _helper.nextToken(parse_token.rest);
  if (!parse_token.token) paramCheck = false;
  app.cur_reward = parseFloat(parse_token.token);
  if (app.cur_reward == NaN) paramCheck = false;
  if (!paramCheck) {
    console.log('ERROR: Invalid Parameters');
    return;
  }

  // Update the running states
  app.prev_action = app.agent.next(app.prev_state, app.prev_action, app.cur_state, app.cur_reward);
  app.prev_state = app.cur_state;

  // Output the action
  console.log('ACTION "%s"', app.prev_action);
}


app.run = function () {
  // Initialize the artificial intelligence agent
  var actions = ['E', 'W', 'N', 'S'];
  var states  = ['(1,3)', '(2,3)', '(3,3)', '(4,3)',
                 '(1,2)', '(2,2)', '(3,2)', '(4,2)',
                 '(1,1)', '(2,1)', '(3,1)', '(4,1)'];
  var discount_rate    = 0.5;
  var acceptable_error = 0.05;
  app.agent = new AgentEntity(actions, states, discount_rate, acceptable_error);

  // Initialize the initial running states
  app.prev_state  = '(1,1)';
  app.prev_action = 'E';
  app.cur_state   = undefined;
  app.cur_reward  = undefined;

  // Initialize the command line interface
  var cli = readline.createInterface(process.stdin, process.stdout);
  cli.setPrompt('>> ');

  // Run the system
  console.log('>> (1,1) -0.1');
  console.log('ACTION "%s"', app.prev_action);
  cli.prompt();
  cli.on('line', function (line) {
    // Select command
    var parse_token = _helper.nextToken(line);
    switch (parse_token.token) {
      case 'show':
        app.showAgent();
        break;

      case 'next':
        app.next(parse_token.rest);
        break;

      case 'exit':
        process.exit(0);
        break;

      default:
        console.log('ERROR: Invalid Command');
        break;
    }

    // Prompt for the next input
    cli.prompt();
  }).on('close', function() {
    process.exit(0);
  });
}


// Launch the application
app.run();


