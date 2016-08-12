module.exports = function(fn) {
    this.process = function(req, res) {
        var params = null;
        return fn.apply(this, [req, res, params]);
    };
};
