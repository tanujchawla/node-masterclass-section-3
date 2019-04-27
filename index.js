/**
 * Primary file for the API
 * 
 */

//Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

//The server should respond to all requests with a string
const server = http.createServer((req, res) => {

    // Get the url and parse it
    let parsedUrl = url.parse(req.url, true);

    //Get the path
    let path = parsedUrl.pathname;
    let trimmedPath = path.replace(/^\/+|\/+$/g,'');

    //Get the HTTP method
    let method = req.method.toLowerCase();

    //Get the query string object
    let queryObj = parsedUrl.query;

    //Get request headers object
    let headers = req.headers;

    //Get the request payload, if any
    let decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', (data) => {
        buffer += decoder.write(data);
    });
    req.on('end', () => {
        buffer += decoder.end();

        //Choose the handler this request should go to, if one is not found, use notFound handler
        let chosenHandler = typeof(router[trimmedPath]) !== undefined ? router[trimmedPath] : handlers.notFound ;

        //Contruct a data object to send to handler
        let data = {
            trimmedPath : trimmedPath,
            queryStringObject : queryObj,
            method : method,
            headers : headers,
            payload : buffer
        };
        console.log(chosenHandler);
        //Route the request to the handler specified in the request
        chosenHandler(data, (statusCode, payload) => {
            //Use the status code called back by the handler, or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            //Use the payload called back by the handler, or default as an empty object
            payload = typeof(payload) == 'object' ? payload : {};

            //Convert the payload to string
            let payloadString = JSON.stringify(payload);

            //Return the response
            res.writeHead(statusCode);
            res.end(payload);
        }); 

        // //Send the response
        // res.end('Hello!\n');

        // //Log the request
        // console.log('Request path: ' + trimmedPath);
        // console.log('Request method: ' + method);
        // console.log('Query object: ', queryObj);
        // console.log('Request headers: ', headers);
        // console.log('Request payload: ', buffer);
    });
    
});

//Start the server and run it on port 3000
server.listen(3000, () => {
    console.log('Listening on port 3000!');
});

//Define the handlers
var handlers = {};

//Sample handler
handlers.sample = (data, callback) => {

    //Callback an http status code, and a payload object
    callback(406, { name : 'Sample handler' });

};

//Not found handler
handlers.notFound = (data, callback) => {
    callback(404);
};

//Define a router
var router = {
    'sample' : handlers.sample
};