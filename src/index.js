var cwd = process.cwd(),
    http = require('http'),
    bodyParser = require('body-parser'),
    config = require(cwd + '/config'),
    router = require(cwd + '/src/lib/router'),
    registry = require(cwd + '/src/lib/registry'),
    port = config('port'),
    server;

router.get('/', function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });

    res.write('Echo server ready. Register responses by POSTing JSON payloads to /._.');
    res.end();
});


router.get('/._./getall', function(req, res) {
    var handlers = registry.getAll();

    var bodystuff = JSON.stringify(handlers);
    res.write(bodystuff);

    res.end();
});

router.post('/._.', function(req, res) {
    bodyParser.json()(req, res, function() {
        if (!req.body.path || !req.body.method || !req.body.payload) {
            return router.e500(Error('req.body.path, req.body.method and req.body.payload must be provided')).process(req, res);
        }

        registry.set(req.body.path, req.body.method, req.body.payload);

        res.writeHead(201, {
            'Content-Type': 'text/plain'
        });

        res.end();
    });
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
