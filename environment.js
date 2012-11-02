var Environment = function(parent) {
    var env = {};

    this.get = function(name) {
        if (name in env) {
            return env[name];
        } else {
            if (parent) {
                return parent.get(name);
            } else {
                throw Error(name+" not found");
            }
        }
    }
    this.set = function(name, value) {
        env[name] = value;
    }
}
module.exports = Environment;
