var Model = require('./model.js');
var Statements = {
    import : function(name) {
        var lib = require(name);
        var obj = Model.Type.jsproxy['new'](lib);
        return obj;
    }
}
var express = Statements.import('express');
x = express.get("createServer")();
x.listen(8080)
