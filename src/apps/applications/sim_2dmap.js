/**
 * General reinforcement learning system two-dimensional map simulation 
 * application.
 *
 * Author:  David Qiu
 * Email:   david@davidqiu.com
 * Website: http://www.davidqiu.com/
 *
 * Copyright (C) 2015, David Qiu. All rights reserved.
 */

var AgentEntity = drequire('agent');
var SimulatorEntity = drequire('simulator-2dmap');
var readline = require('readline');
var fs = require('fs');

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
  console.log('============ [ Agent ] =============');
  console.log(app.agent);
  console.log('====================================');
}


app.showMap = function () {
  console.log('============= [ Map ] ==============');
  for (var j=app.simulator.map_size.height-1; j>=0; --j) {
    var raw = '' + j + ' ';
     for (var i=0; i<app.simulator.map_size.width; ++i) {
      if (app.simulator.pos_x == i && app.simulator.pos_y == j) {
        raw += 'A';
      } else if (app.simulator.map[i][j] == 'O') {
        raw += '.';
      } else if (app.simulator.map[i][j] == 'X') {
        raw += 'X';
      } else {
        raw += '?';
      }
    }
    console.log(raw);
  }
  console.log();
  var raw = '+ ';
  for (var i=0; i<app.simulator.map_size.width; ++i) raw += i;
  console.log(raw);
  console.log('====================================');
}


app.showPosition = function () {
  console.log('=========== [ Position ] ===========');
  console.log('pos_x:', app.simulator.pos_x);
  console.log('pos_y:', app.simulator.pos_y);
  console.log('====================================');
}


app.show = function (paramLine) {
  // Select content to show
  var parse_token = _helper.nextToken(paramLine);
  switch (parse_token.token) {
    case 'agent':
      app.showAgent();
      break;

    case 'map':
      app.showMap();
      break;

    case 'pos': case 'position':
      app.showPosition();
      break;

    default:
      console.log('ERROR: Invalid Arguments');
      return;
  }
}


app.next = function (paramLine) {
  // Initialize switches
  var switch_map = false;

  // Check the command arguments
  var parse_token = _helper.nextToken(paramLine);
  while (parse_token.token) {
    switch (parse_token.token) {
      case '-m': case '--map':
        switch_map = true;
        break;

      default:
        var err = new Error('ERROR: Invalid Arguments');
        err.arguments = { paramLine: paramLine, token: parse_token.token };
        throw err;
    }
    parse_token = _helper.nextToken(parse_token.rest);
  }

  // Update the running states
  app.prev_action = app.agent.next(app.prev_state, app.prev_action, app.cur_state, app.cur_reward);
  app.prev_state = app.cur_state;
  var sim_result = app.simulator.next(app.prev_action);
  app.cur_state = sim_result.state;
  app.cur_reward = sim_result.reward;

  // Output the running log
  console.log('ACTION %s', app.prev_action);
  console.log('STATE  %s', app.cur_state);
  console.log('REWARD %s', app.cur_reward);

  // Show map
  if (switch_map) {
    app.showMap();
  }
}


app.save = function (paramLine) {
  // Define general variables
  var filepath = undefined;

  // Check the arguments
  var argCheck = true;
  var parse_token = _helper.nextToken(paramLine);
  if (!parse_token.token) argCheck = false;
  else {
    filepath = parse_token.token;
  }
  if (!argCheck) {
    console.log('ERROR: Invalid Arguments');
    return;
  }

  // Inform the file path
  console.log('file path:', filepath);

  // Check the existence of the file
  var file_exists = fs.existsSync(filepath);
  console.log('file exists:', file_exists);

  // Check if the file exists
  if (!file_exists) {
    var save_object = {
      simulator:    app.simulator,
      agent:        app.agent,
      prev_state:   app.prev_state,
      prev_action:  app.prev_action,
      cur_state:    app.cur_state,
      cur_reward:   app.cur_reward
    };
    fs.writeFileSync(filepath, JSON.stringify(save_object));
    console.log('file saved:', 'success');
  } else {
    console.log('file saved:', 'error');
  }
}


app.load = function (paramLine) {
  // TODO
  throw new Error('TODO');
}


app.run = function () {
  // Initialize the simulator of two-dimensional map simulation
  var map = [
    ['O','O','O','O','O','O'],
    ['O','X','O','O','X','X'],
    ['O','O','O','O','O','O'],
    ['O','O','O','O','O','O'],
    ['O','X','O','O','O','O'],
    ['X','X','O','O','X','O']
  ];
  var ir_capability    = 3;
  var initial_position = { x: 0, y: 0 };
  app.simulator = new SimulatorEntity(map, ir_capability, initial_position.x, initial_position.y);

  // Initialize the artificial intelligence agent
  var discount_rate    = 0.5;
  var acceptable_error = 0.05;
  app.agent = new AgentEntity(app.simulator.actions, app.simulator.states, discount_rate, acceptable_error);

  // Initialize the initial running states
  app.prev_state  = app.simulator.getState();
  app.prev_action = 'W';
  app.cur_state   = app.simulator.getState();
  app.cur_reward  = app.simulator.getReward(app.prev_action);

  // Initialize the command line interface
  var cli = readline.createInterface(process.stdin, process.stdout);
  console.log('Commands:');
  console.log('  - next [-m|--map]');
  console.log('  - show agent|map|pos|position');
  console.log('  - save <filepath>');
  console.log('  - load <filepath>');
  console.log('  - exit');
  console.log();
  cli.setPrompt('>> ');

  // Run the system
  console.log('>> next');
  console.log('ACTION %s', app.prev_action);
  console.log('STATE  %s', app.cur_state);
  console.log('REWARD %s', app.cur_reward);
  cli.prompt();
  cli.on('line', function (line) {
    // Select command
    var parse_token = _helper.nextToken(line);
    switch (parse_token.token) {
      case 'show':
        app.show(parse_token.rest);
        break;

      case 'next':
        app.next(parse_token.rest);
        break;

      case 'save':
        app.save(parse_token.rest);
        break;

      case 'load':
        app.load(parse_token.rest);
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


module.exports = app;
