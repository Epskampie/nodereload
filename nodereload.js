var WebSocketServer = require('websocket').server;
var http = require('http');
var fs = require('fs');
var watch = require('watch');
var directories = require('./directories');

var directories = directories.directories;
var connections = [];

var server = http.createServer(function(request, response) {
    // process HTTP request. Since we're writing just WebSockets server
    // we don't have to implement anything.
    console.log('Got HTTP request', request.url);
    fs.readFile('./livereload.js', function(error, content) {
        if (error) {
            response.writeHead(500);
            response.end();
        }
        else {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(content, 'utf-8');
        }
    });
});

server.on('error', function(error) {
  if (error.code == 'EADDRINUSE') {
    console.log('Listen port 35729 already in use. Close all NodeReload windows before starting a new one.');
  } else {
    console.log('Error: ', error);
  }
});

server.listen(35729, function() {

  // create the server
  wsServer = new WebSocketServer({
      httpServer: server
  });

  // WebSocket server
  wsServer.on('request', function(request) {
    console.log('Got request');
    var connection = request.accept(null, request.origin);
    connections.push(connection);
    console.log('Got connection',connections.length);

    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
      console.log('Got message', message.utf8Data);
      if (message.type === 'utf8') {
        console.log('');

        request = JSON.parse(message.utf8Data);

        if (request.command == 'hello') {
          console.log('got hello');
          connection.sendUTF(JSON.stringify({
            command: 'hello',
            protocols: [
              'http://livereload.com/protocols/connection-check-1',
              'http://livereload.com/protocols/official-7',
              'http://livereload.com/protocols/2.x-origin-version-negotiation',
              'http://livereload.com/protocols/2.x-remote-control'],
            serverName: 'NodeReload',
          }));
        } else {
          console.log('unknown command', request.command);
        }
      }
    });

    connection.on('close', function() {
      connections = connections.filter(function(elem) { return elem != connection; });
      console.log('connection closed', connections.length);
    });
  });

  watchDirs();
});

function watchDirs() {
  for (var index in directories) {
    if (!fs.existsSync(directories[index])) {
      console.error('The following directory does not exist: ', directories[index]);
      continue;
    } else {
      console.log('Watching: ', directories[index]);
    }
    
    watch.watchTree(directories[index], {interval: 200}, function (f, curr, prev) {
      if (typeof f == "object" && prev === null && curr === null) {
        // Finished walking the tree
        // console.log('done walking');
      } else if (prev === null) {
        // f is a new file
        scheduleReload(f, false);
      } else if (curr && curr.nlink === 0) {
        // f was removed
      } else {
        // f was changed
        scheduleReload(f, true);
      }
    });
  }
}

var scheduleTimeout = null;
var scheduleLiveCss = false;
var scheduleFiles = [];

function scheduleReload(file, liveCss){
  if (file && file.substr(-4) == '.tmp' ) {
    return;
  }
  
  clearTimeout(scheduleTimeout);
  scheduleLiveCss = scheduleLiveCss || liveCss;
  scheduleFiles.push(file);
  scheduleTimeout = setTimeout(sendReload, 100); // Delay for a few milliseconds, to see if any more arrive
  console.log('delaying');
}

function sendReload(){
  var payload = JSON.stringify({
    command: 'reload',
    path: scheduleFiles[0],   // as full as possible/known, absolute path preferred, file name only is OK
    liveCSS: false,//scheduleLiveCss === true // false to disable live CSS refresh
  });
  connections.forEach(function(connection) {
    connection.sendUTF(payload);
  })
  
  scheduleLiveCss = false;
  scheduleFiles = [];

  console.log('sending to ' + connections.length + ' connections: ', payload);
}