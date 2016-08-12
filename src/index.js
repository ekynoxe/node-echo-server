var cwd = process.cwd(),
    http = require('http'),
    config = require(cwd + '/config'),
    router = require(cwd + '/src/lib/router'),
    port = config('port'),
    server;

router.get('/', function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.write('Hello World');
    res.end();
});

server = http.createServer(function(req, res) {
    router.route(req, res);
});

server.listen(port, function() {
    console.log('Server listening on port ', port);

    process.on('uncaughtException', function (err) {
        console.error(err);
    });

    process.on('SIGTERM', function () {
        server.close(function () {
            console.log('Server closed on port', port);
            process.exit(0);
        });
    });
});
