var Util = require('./util.js');
var Type = {
    __str__ : function() {
        return this.__repr__();
    },
    __repr__ : function() {
        return "'"+this._exp+"'";
    },
    __add__ : function(b) {
        return this._exp+b;
    },
}
var Types = {
    list : function(exp) {
        this._exp = exp;
        this.__str__ = function() {
            return new Util.Delimiter(", ","[","]").join(this._exp);
        }
        this.__add__ = function(b) {
            return new Types.list(this._exp.concat(b._exp));
        }
        this.extend = function(b) {
            this._exp.push.apply(this._exp, b._exp);
        }
        this.append = function(b) {
            this._exp.push(b._exp);
        }
    },
    str : function(exp) {
        this._exp = exp;
        this.__add__ = function(b) {
            return new Types.str(this._exp + b._exp);
        }
    },
    int : function(exp) {
        this._exp = exp;
        this.__add__ = function(b) {
            return new Types.Int(this._exp + b._exp);
        }
        this.__sub__ = function(a, b) {
            return this.__add__(-b);
        }
        this.__mul__ = function(b) {
            return _exp*b;
        }
    },
    float : function(exp) {
        this._exp = exp;
        this.__add__ = function(b) {
            return new Types.Float(this._exp + b._exp);
        }
        this.__sub__ = function(a, b) {
            return this.__add__(-b);
        }
        this.__mul__ = function(b) {
            return new Types.Float(this._exp * b._exp);
        }
    }
}
for (var expr in Types) {
    Types[expr].prototype = Type;
}
Model = {
    'Type' : Types
}
module.exports = Model;
