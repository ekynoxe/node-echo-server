var cwd = process.cwd(),
    url = require('url'),
    pathRegexp = require('path-to-regexp'),
    registry = require(cwd + '/src/lib/registry'),
    Handler = require(cwd + '/src/lib/handler'),
    handlers = {},
    Router;

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
            regexp = pathRegexp(parsedUrl.pathname, keys),
            keys = [],
            handler,
            match;

        for (var path in handlers) {
            match = regexp.exec(path);
            if (match) {
                handler = (handlers[path][method] || handlers[path]['*']);
                if (handler) {
                    break;
                }
            }
        }

        // No server route found, trying registry
        if (!handler) {
            handler = registry.get(parsedUrl.pathname, method);
        }

        // No server or registry route found, serving a 404
        if (!handler) {
            handler = this.e404(req);
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
