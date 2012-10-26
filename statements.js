var Model = require('./model.js');
var Statements = {
    import : function(name) {
        hello
        var lib = require(name);
        var obj = Model.Util.JSWrap(lib);
        return obj;
    },
    def : function(name, formals, body) {
    }
}
var express = Statements.import('express');
x = express.call();
x.get('get').call('/', function(req, res) {
    res.send("SUP bro");
})
x.get('listen').call(8080);
