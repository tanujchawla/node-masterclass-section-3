/**
 * Primary file for the API
 * 
 */

//Dependencies
const http = require('http');

//The server should respond to all requests with a string
const server = http.createServer((req, res) => {
    res.end('Hello!\n');
});

//Start the server and run it on port 3000
server.listen(3000, () => {
    console.log('Listening on port 3000!');
});