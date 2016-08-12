var data = {},
    Registry;

Registry = {
    set: function set(url, method, payload) {
        data[url] = data[url] || {};
        data[url][method] = { payload: payload };
    },

    get: function get(url, method) {
        return (data[url][method] || data[url]['*']);
    }
};

module.exports = Registry;
