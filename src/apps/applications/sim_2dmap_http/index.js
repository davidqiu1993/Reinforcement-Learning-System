/**
 * General reinforcement learning system two-dimensional map simulation 
 * application for HTTP.
 *
 * Author:  David Qiu
 * Email:   david@davidqiu.com
 * Website: http://www.davidqiu.com/
 *
 * Copyright (C) 2015, David Qiu. All rights reserved.
 */

var AgentEntity = drequire('agent');
var SimulatorEntity = drequire('simulator-2dmap');
var http = require('http');
var url = require('url');
var fs = require('fs');

var app = {};
var routes = {};
var _helper = {};


routes.get = function (pathname, handler) {
  if (!routes.list) routes.list = {};
  if (!routes.list['get']) routes.list['get'] = {};
  routes.list['get'][pathname.toLowerCase()] = handler;
}


routes.post = function (pathname, handler) {
  if (!routes.list) routes.list = {};
  if (!routes.list['post']) routes.list['post'] = {};
  routes.list['post'][pathname.toLowerCase()] = handler;
}


_helper.response = function (req, res, status, data) {
  res.writeHead(status, { 'content-type': 'text/json' });
  res.end(JSON.stringify(data));
}


_helper.responseView = function (req, res, view) {
  fs.readFile(__dirname + '/views/' + view, function (err, view_file) {
    res.writeHead(200);
    res.end(view_file);
  });
}


_helper.handleInvalid = function (req, res) {
  _helper.response(req, res, 400, { 'error': 'Invalid Request' });
}


_helper.responseGet = function (req, res, data) {
  _helper.response(req, res, 200, data);
}


_helper.responsePost = function (req, res, data) {
  _helper.response(req, res, 201, data);
}


_helper.createHttpServer = function (routes) {
  // Create HTTP server
  var server = http.createServer(function (req, res) {
    // Output the request log
    console.log(req.method, req.url);

    // Define general variables
    var parsed_url       = url.parse(req.url, true);
    var request_method   = req.method.toLowerCase();
    var request_pathname = parsed_url.pathname.toLowerCase();

    // Check the route existence
    var routeExists = true;
    if (!routes.list) routeExists = false;
    else if (!routes.list[request_method]) routeExists = false;
    else if (!routes.list[request_method][request_pathname]) routeExists = false;
    
    // Check if the route exists
    if (routeExists) {
      var route = routes.list[request_method][request_pathname];
      var received_data = '';
      req.addListener('data', function (chunk) {
        received_data += chunk;
      });
      req.addListener('end', function () {
        try {
          req.body = JSON.parse(received_data);
        } catch (err) {
          req.body = {};
        }
        req.query = parsed_url.query;
        route(req, res);
      });
    } else {
      console.log('ERROR   %s', 'The request pathname is invalid.');
      _helper.handleInvalid(req, res);
    }
  });

  // Return the server
  return server;
}


routes.post('/simulator', function (req, res) {
  // Initialize the simulator of two-dimensional map simulation
  var map              = req.body.map;
  var ir_capability    = req.body.ir_capability;
  var initial_position = req.body.initial_position;
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

  // Output the running log
  console.log('INIT    (%s, %s)', initial_position.x, initial_position.y);

  // Response the simulator configurations
  _helper.responsePost(req, res, {
    map:              map,
    ir_capability:    ir_capability,
    initial_position: initial_position
  });
});


routes.get('/next', function (req, res) {
  // Check simulator initialization
  if (!( app.simulator && app.agent )) {
    _helper.handleInvalid(req, res);
    console.log('ERROR   %s', 'The simulator is not initialized.');
    return;
  }

  // Update the running states
  app.prev_action = app.agent.next(app.prev_state, app.prev_action, app.cur_state, app.cur_reward);
  app.prev_state = app.cur_state;
  var sim_result = app.simulator.next(app.prev_action);
  app.cur_state = sim_result.state;
  app.cur_reward = sim_result.reward;

  // Output the running log
  console.log('ACTION  %s', app.prev_action);
  console.log('POS     (%s, %s)', app.simulator.pos_x, app.simulator.pos_y);
  console.log('STATE   %s', app.cur_state);
  console.log('REWARD  %s', app.cur_reward);

  // Response the next status
  _helper.responseGet(req, res, {
    action: app.prev_action,
    position: {
      x: app.simulator.pos_x,
      y: app.simulator.pos_y
    },
    state: app.cur_state,
    reward: app.cur_reward
  });
});


routes.get('/', function (req, res) {
  console.log('VIEW    %s', 'homepage.html');
  _helper.responseView(req, res, 'homepage.html');
});


routes.get('/homepage.css', function (req, res) {
  console.log('VIEW    %s', 'homepage.css');
  _helper.responseView(req, res, 'homepage.css');
})


routes.get('/homepage.js', function (req, res) {
  console.log('VIEW    %s', 'homepage.js');
  _helper.responseView(req, res, 'homepage.js');
})


app.run = function () {
  var server = _helper.createHttpServer(routes);
  server.listen(3000);
}


module.exports = app;
