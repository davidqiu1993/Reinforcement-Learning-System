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

var readline = require('readline');
var apps = drequire('apps');

var _helper = {};


_helper.showHeader = function (name) {
  var splitLine = '';
  for (var i=0; i<name.length + 20; ++i) splitLine = splitLine + '=';
  console.log();
  console.log(splitLine);
  console.log('          ' + name + '          ');
  console.log(splitLine);
  console.log();
}


// Load application
var cli = readline.createInterface(process.stdin, process.stdout);
console.log('Applications:');
for (var app in apps) {
  console.log('  - ' + app);
}
console.log();
cli.setPrompt('LOAD >> ');
cli.prompt();
cli.on('line', function (line) {
  var appName = line.trim();
  if (apps[appName]) {
    console.log('Load application:', appName);
    console.log();
    _helper.showHeader(appName);
    cli.close();
    apps[appName].run();
  } else {
    console.log('The application does not exist.');
    cli.prompt();
  }
});


