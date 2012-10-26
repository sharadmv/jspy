var Util = require('./util.js');
var OOP = require('./oop.js');
var makeClass = OOP.makeClass;
var Types = {
    tuple : makeClass({
        '__init__' : function(self, lst) {
            self.secret["type"] = "tuple"
            if (lst){
                self.secret["value"] = lst.secret["value"];
            } else {
                self.secret["value"] = [];
            }
        },
        '__str__' : function(self) {
            return new Util.Delimiter(", ","(",")").join(self.obtain("value"));
        },
        '__add__' : function(self, b) {
            var tup = Types.tuple['new']();
            tup.secret["value"] = self.obtain("value").concat(b.obtain("value"));
            return tup;
        },
        'extend' : function(self, b) {
            self.obtain("value").push.apply(self.obtain("value"), b.obtain("value"));
        },
    }),
    list : makeClass({
        '__init__' : function(self, lst) {
            self.secret["type"] = "list"
            if (lst){
                self.secret["value"] = lst.get["value"];
            } else {
                self.secret["value"] = [];
            }
        },
        '__str__' : function(self) {
            return new Util.Delimiter(", ","[","]").join(self.obtain("value"));
        },
        '__add__' : function(self, list) {
            var lst = Types.list['new']();
            lst.secret["value"] = self.obtain("value").concat(list.obtain("value"));
            return lst;
        },
        'extend' : function(self, b) {
            self.secret["value"].push.apply(self.obtain("value"), b.obtain("value"));
        },
        'append' : function(self, b) {
            self.obtain("value").push(b);
        }
    }),
    jsproxy : makeClass({
        '__init__' : function(self, obj, parent) {
            self.secret["type"] = "jsproxy"
            self.secret["value"] = obj;
            if (parent) {
                self.secret["parent"] = parent;
            }
        },
        '__getattr__' : function(self, name) {
            return util.JSWrap(self.obtain("value")[name], self.obtain('value'));
        },
        '__str__' : function(self) {
            return self.obtain(name);
        }
    }),
    jsfunction : makeClass({
        '__init__' : function(self, func, parent) {
            self.secret["type"] = "jsfunction"
            self.secret["value"] = func;
            if (parent) {
                self.secret["parent"] = parent;
            }
            self.secret["callable"] = true;
            self.call = function() {
                //var arr = [];
                //for (var i in arguments) {
                    //arr.push(arguments[i]);
                //}
                if(parent) {
                    ret = self.obtain('value').apply(parent, arguments);
                } else {
                    ret = self.obtain('value').apply(self.obtain('value'), arguments);
                }
                return util.JSWrap(ret, this.obtain('value'));
            }
        },
        '__getattr__' : function(self, name) {
            return util.JSWrap(self.obtain("value")[name], self.obtain('value'));
        },
        '__str__' : function(self) {
            return self.obtain(name);
        }
    }),
}
var util = {
    JSWrap : function(ret, parent) {
        if (typeof(ret) == "object") {
            return Types.jsproxy['new'](ret, parent);
        } else if (typeof(ret) == "function") {
            return Types.jsfunction['new'](ret, parent);
        } else {
            return ret;
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
    'Type' : Types,
    'Util' : util
}
module.exports = Model;
