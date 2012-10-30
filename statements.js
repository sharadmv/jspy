var Model = require('./model.js');
var Statements = {
    Import : function(names) {
        this.eval = function(env) {
            for (var i in names) {
                var lib = require(name);
                var obj = Model.Util.JSWrap(lib);
                env.set(names[i], obj);
            }
        }
    },
    Def : function(name, formals, body) {
        var name = name;
        var formals = formals;
        var body = body;
        this.eval = function(env) {
            //TODO construct function
            env.set(name, func);
        }
    },
    Return : function(expr) {
    },
    Assignment : function(name, expression) {
        this.eval = function(env) {
            env.set(name, expression.eval());
        }
    },
    IdentifierExpression : function(name) {
        this.eval = function(env) {
            return env.get('name');
        }
    },
    CallExpression : function(operator, operands) {
        this.eval = function(env) {
            func = env.eval();
            operands = map(function(operand){
                return operand.eval();
            });
            return func.__call__(operands);
        }
    }
}
var express = Statements.import('express');
x = express.call();
x.get('get').call('/', function(req, res) {
    res.send("SUP bro");
})
x.get('listen').call(8080);
