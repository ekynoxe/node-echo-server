var pathRegexp = require('path-to-regexp'),
    Handler = require(process.cwd() + '/src/lib/handler'),
    data = {},
    Registry;

Registry = {
    set: function set(path, method, payload) {
        data[path] = data[path] || {};
        data[path][method] = { payload: payload };
    },

    get: function get(path, method) {
        var handler,
            keys = [],
            regexp = pathRegexp(path, keys),
            match;

        for (var savedPath in data) {
            match = regexp.exec(savedPath);

            if (match) {
                handler = (data[savedPath][method] || data[savedPath]['*']);
                if (handler) {
                    break;
                }
            }
        }

        return handler && new Handler(function(req, res) {
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });

            var bodystuff = JSON.stringify(handler.payload);
            res.write(bodystuff);

            res.end();
        });
    }
};

module.exports = Registry;
