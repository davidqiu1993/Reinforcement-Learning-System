// Set block
var setBlock = function (block, type) {
  block.removeClass('path');
  block.removeClass('obstacle');
  block.removeClass('agent');
  switch (type) {
    case 'path':     block.addClass('path'); break;
    case 'obstacle': block.addClass('obstacle'); break;
    case 'agent':    block.addClass('agent'); break;
    default:         break;
  }
}


// callback = function ();
var refreshMapView = function (map_view, map, pos_x, pos_y, callback) {
  for (var i=0; i<map.length; ++i) {
    for (var j=0; j<map[i].length; ++j) {
      if (map[i][j] == 'O') {
        setBlock(map_view[i][j], 'path');
      } else if (map[i][j] == 'X') {
        setBlock(map_view[i][j], 'obstacle');
      }
      if (pos_x == i && pos_y == j) {
        setBlock(map_view[i][j], 'agent');
      }
    }
  }
  if (typeof(callback) == 'function' || callback instanceof Function) {
    callback();
  }
}


// callback = function (data)
var initServer = function (map, ir_capability, initial_position, callback) {
  $('#status-server').text('Waiting');
  $.post(
    '/simulator',
    JSON.stringify({ map: map, ir_capability: ir_capability, initial_position: initial_position }),
    function (data) {
      $('#status-server').text('Ready');
      $('#status-action').text('<N/A>');
      $('#status-position').text('(' + initial_position.x + ',' + initial_position.y + ')');
      $('#status-state').text('<N/A>');
      $('#status-reward').text('<N/A>');
      if (typeof(callback) == 'function' || callback instanceof Function) {
        callback(data);
      }
    }
  );
}


// callback = function (data)
var nextState = function (callback) {
  $('#status-server').text('Waiting');
  $.get(
    '/next',
    function (data) {
      $('#status-server').text('Ready');
      $('#status-action').text(data.action);
      $('#status-position').text('(' + data.position.x + ',' + data.position.y + ')');
      $('#status-state').text(data.state);
      $('#status-reward').text(data.reward);
      if (typeof(callback) == 'function' || callback instanceof Function) {
        callback(data);
      }
    }
  );
}


// Initialize the configurations of simulation
var map = [
  ['O', 'O', 'O', 'O', 'O', 'O'],
  ['O', 'X', 'O', 'O', 'X', 'X'],
  ['O', 'X', 'X', 'O', 'X', 'O'],
  ['O', 'O', 'O', 'O', 'O', 'O'],
  ['O', 'O', 'O', 'O', 'O', 'O'],
  ['O', 'O', 'O', 'O', 'X', 'O']
];
var ir_capability = 3;
var initial_position = { x: 0, y: 0 };
var map_size = {
  width:  map.length,
  height: map[0].length
}

// Initialize the map view
var map_view = [];
for (var i=0; i<map_size.width; ++i) {
  map_view.push([]);
  for (var j=0; j<map_size.height; ++j) {
    map_view.push({});
  }
}
var map_view_table = $('<table></table>');
var map_view_tbody = $('<tbody></tbody>');
map_view_table.append(map_view_tbody);
for (var j=map_size.height-1; j>=0; --j) {
  var map_view_raw = $('<tr></tr>');
  map_view_tbody.append(map_view_raw);
  for (var i=0; i<map_size.width; ++i) {
    map_view[i][j] = $('<td></td>');
    map_view_raw.append(map_view[i][j]);
  }
}

// Initialize the control
var control = {};
control.initialize = function () {
  initServer(map, ir_capability, initial_position, function (data) {
    refreshMapView(map_view, map, initial_position.x, initial_position.y);
  });
}
control.next = function () {
  nextState(function (data) {
    refreshMapView(map_view, map, data.position.x, data.position.y);
  });
}

// Initialize the map view
refreshMapView(map_view, map, initial_position.x, initial_position.y);

// Initialize the simulation area
$('#sim').append(map_view_table);

// Initialize the status area
$('#status-server').text('Disconnected');
$('#status-action').text('<N/A>');
$('#status-position').text('(' + initial_position.x + ',' + initial_position.y + ')');
$('#status-state').text('<N/A>');
$('#status-reward').text('<N/A>');

// Initialize the simulation server
initServer(map, ir_capability, initial_position);


