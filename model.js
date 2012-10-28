var Util = require('./util.js');
var OOP = require('./oop.js');
var makeClass = OOP.makeClass;
var Types = {
    tuple : makeClass({
        '__init__' : function(self, lst) {
            self.set("_type", "tuple")
            if (lst){
                self.set('_exp', lst.get('_exp'));
            } else {
                self.set('_exp', []);
            }
        },
        '__str__' : function(self) {
            return new Util.Delimiter(", ","(",")").join(self.get('_exp'));
        },
        '__add__' : function(self, b) {
            var tup = Types.tuple['new']();
            tup.set('_exp', self.get('_exp').concat(b.get('_exp')))
            return tup;
        },
        'extend' : function(self, b) {
            self.get('_exp').push.apply(self.get('_exp'), b.get('_exp'));
        },
    }),
    list : makeClass({
        '__init__' : function(self, lst) {
            self.set("_type", "list")
            if (lst){
                self.set('_exp', lst.get('_exp'));
            } else {
                self.set('_exp', []);
            }
        },
        '__str__' : function(self) {
            return new Util.Delimiter(", ","[","]").join(self.get('_exp'));
        },
        '__add__' : function(self, list) {
            var lst = Types.list['new']();
            lst.set('_exp', self.get('_exp').concat(list.get('_exp')));
            return lst;
        },
        'extend' : function(self, b) {
            self.get('_exp').push.apply(self.get('_exp'), b.get('_exp'));
        },
        'append' : function(self, b) {
            self.get('_exp').push(b);
        }
    }),
    jsproxy : makeClass({
        '__init__' : function(self, obj) {
            self.set("_type", "jsproxy")
            self.set("_exp", obj);
        },
        '__getattr__' : function(self, name) {
            return self.get("_exp")[name];
        },
        '__str__' : function(self) {
            return self.get("_exp");
        }
    }),
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
    },
}
var list = Types.list['new']();
var list2 = Types.list['new']();
list.get('append')(5);
list2.get('append')(6);
var tup = Types.tuple['new'](list);
tup = tup.get('__add__')(tup);
tup = tup.get('__add__')(tup);
tup = tup.get('__add__')(tup);
tup = tup.get('__add__')(tup);
console.log(tup.get('__str__')());
list.get('extend')(list2);
console.log(list.get('__add__')(list2).toString());
console.log(list.toString());
Model = {
    'Type' : Types
}
module.exports = Model;
