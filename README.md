# NODE JS ECHO SERVER
This server is designed to run locally and replace unavailable remote ones, whether to work in isolation from the network, or to control the data fully for integration testing.

The workflow is simple:
* The client issues a POST request to a designated endpoint on the echo server (`/._./`) with all the options and payload the response will need to have. For example `POST http://<echoserver_url>/._./` with `{ "path": "/the/required/path/", "method": "get", "payload": { "foo": "bar"}}`.
* The client replaces the base url for its network calls by the echo server one. For example `http://<echoserver_url>/the/required/path/`.
* The client places its usual network calls (now replaced with the echo server one).
* The echo server responds to the client request with the previously posted data and options.

## Installation
* `git clone repo_url ./echo_Server`
* `cd echo_server/`
* `npm install`

## Run
* `npm start`

## Methods
Use any method you want in the JSON object sent to the registration. I haven't tested them all, but the underlying library is the standard NodeJS HTTP one: https://nodejs.org/api/http.html

## Wildcards
You can use a wildcard `*` as the method if you want the echo server to return the same response to any HTTP request method used on your specified handler:

```
POST
http://<echoserver_url>/._./
{  
    "path": "/the/required/path/",  
    "method": "*",  
    "payload": { "foo": "bar"}  
}  
```

## Feature requests
* Allow regexp as routes to allow for optional parameters and route globing elements.
* Allow parameters in urls. First to be able to route similar pattern urls, then, maybe to do some fancier work before returning a response.
* Allow more options for registering calls:
  * status codes
  * headers
  * delayed responses to alternate endpoint after initial call (for example, for web-hooks)
* Allow different payload types, based on Content-Type header.
