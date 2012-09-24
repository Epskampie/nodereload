var directories = [
  // Put the directories you want to watch here.
  // Dont forget to use forward slashed / or escaped backslashes \\\\
  // Uncomment the next lines for an example

  //'C:\\Users\\Simon\\Documents\\MyProject1',
  //'C:\\Users\\Simon\\Documents\\MyProject2',
];

// Don't edit below here.

var WebSocketServer = require('websocket').server;
var http = require('http');
var fs = require('fs');
var watch = require('watch');

var connected = false;
var connection;

var server = http.createServer(function(request, response) {
    // process HTTP request. Since we're writing just WebSockets server
    // we don't have to implement anything.
    console.log('got request', request.url);
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
server.listen(35729, function() { });

// create the server
wsServer = new WebSocketServer({
    httpServer: server
});

// WebSocket server
wsServer.on('request', function(request) {
    connection = request.accept(null, request.origin);

    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('');
            console.log('got message', message);

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

                connected = true;
            } else {
                console.log('unknown command', request.command);
            }
        }
    });

    connection.on('close', function(connection) {
        console.log('connection closed');
        // close user connection
        connected = false;
    });
});

for(var index in directories) {
  watch.watchTree(directories[index], {interval: 200}, function (event, filename) {
    if (event == 'done') {
      // Finished walking the tree
      console.log('done walking');
    } else if (event == 'change') {
      console.log('change', event, filename);
      sendReload(filename, true);
    } else {
      console.log('unknown', event, filename);
      sendReload(filename, false);
    }
  });
}

function sendReload(file, liveCss){
  if (connected) {

    var payload = JSON.stringify({
      command: 'reload',
      path: file,   // as full as possible/known, absolute path preferred, file name only is OK
      liveCSS: liveCss === true // false to disable live CSS refresh
    });
    connection.sendUTF(payload);

    console.log('sending:', payload);
  }
}