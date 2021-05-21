const express = require('express');
const path = require('path');
var http = require('http');

const app = express();

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
});

var httpServer = http.createServer(app);

httpServer.listen(80);

console.log('App is listening');
