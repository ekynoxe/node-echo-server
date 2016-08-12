/* global module, process, require */
'use strict';

var nconf = require('nconf'),
    environment;

nconf.argv().env('_');
environment = nconf.get('NODE:ENV') || 'development';

nconf.file(environment, process.cwd() + '/config/' + environment + '.json');
nconf.file('default', process.cwd() + '/config/default.json');

module.exports = function(key) {
    if (key) {
        return nconf.get(key.toUpperCase());
    } else {
        return nconf.get();
    }
};
