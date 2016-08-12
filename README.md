# NODE JS ECHO SERVER
This server is designed to run locally and replace unavailable remote ones, whether to work in isolation from the network, or to control the data fully for integration testing.

The workflow is simple:
* The client issues a POST request to a designated endpoint on the echo server (TBC) with all the options and payload the response will need to have. For example `POST http://<echoserver_url>/register/` with `{ "path": "/the/required/path/", "payload": { "foo": "bar"}}`.
* The client replaces the base url for its network calls by the echo server one. For example `http://<echoserver_url>/retrieve/`.
* The client places its usual network calls (now replaced with the echo server one).
* The echo server responds to the client request with the previously posted data and options.

This tool is work in progress and the above is the first goal.
