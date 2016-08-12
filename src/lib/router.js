var url = require('url'),
    registry = require(process.cwd() + '/src/lib/registry'),
    handlers = {},
    Router,

    Handler = function(method) {
        this.process = function(req, res) {
            var params = null;
            return method.apply(this, [req, res, params]);
        };
    };

Router = {
    get: function get(uri, func) {
        Router._register(uri, 'get', func);
    },

    post: function post(uri, func) {
        Router._register(uri, 'post', func);
    },

    _register: function _register(uri, method, func) {
        handlers[uri] = handlers[uri] || {};
        handlers[uri][method] = new Handler(func);
    },

    use: function use(uri, func) {
        Router._register(uri, '*', func);
    },

    route: function route(req, res) {
        var parsedUrl = url.parse(req.url, true),
            method = req.method.toLowerCase(),
            handler = (handlers[parsedUrl.pathname] && (handlers[parsedUrl.pathname][method] || handlers[parsedUrl.pathname]['*'])),
            registryHandler;

        if (!handler) {
            registryHandler = registry.get(parsedUrl.pathname, method);

            if (!registryHandler) {
                handler = this.e404(req);
            } else {
                handler = new Handler(function(req, res) {
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    });

                    var bodystuff = JSON.stringify(registryHandler.payload);
                    res.write(bodystuff);

                    res.end();
                });
            }
        }

        return handler.process(req, res);
    },

    e404: function e404 () {
        return new Handler(function(req, res) {
            var parsedUrl = url.parse(req.url, true);

            res.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            res.write('No route registered for ' + req.method + ' ' + parsedUrl.pathname);
            res.end();
        });
    },

    e500: function e500 (e) {
        return new Handler(function(req, res) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.write('Server error ' + e);
            res.end();
        });
    }
};

module.exports = Router;
