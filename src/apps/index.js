/**
 * General reinforcement learning system application collection.
 *
 * Author:  David Qiu
 * Email:   david@davidqiu.com
 * Website: http://www.davidqiu.com/
 *
 * Copyright (C) 2015, David Qiu. All rights reserved.
 */

var fs = require('fs');
var path = require('path');

var apps = {};


// Load the application list
var appList = JSON.parse(fs.readFileSync(path.join(__dirname, 'apps.json')));

// Load the applications
for (var i=0; i<appList.length; ++i) {
  apps[appList[i]] = require('./applications/' + appList[i] + '/index');
}


module.exports = apps;
