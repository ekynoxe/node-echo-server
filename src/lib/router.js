var url = require('url'),
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

    route: function route(req, res) {
        var parsedUrl = url.parse(req.url, true),
            handler = handlers[parsedUrl.pathname] || {},
            method = req.method.toLowerCase();

        if (!handler[method]) {
            handler[method] = this.missing(req);
        }

        return handler[method].process(req, res);
    },

    missing: function missing(req) {
        var parsedUrl = url.parse(req.url, true);

        return new Handler(function(req, res) {
            res.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            res.write('No route registered for ' + req.method + ' ' + parsedUrl.pathname);
            res.end();
        });
    }
};

module.exports = Router;
