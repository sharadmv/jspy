var proxy = {
    makeClass : function(attributes, base) {
        if (base === undefined) {
            base = object;
        }
        var get = function(name) {
            if (name in attributes) {
                return attributes[name];
            } else if (base) {
                return base.get(name);
            }
            throw new Error("AttributeError");
        }
        var set = function(name, value) {
            attributes[name] = value;
        }
        var n = function() {
            return initInstance(cls, arguments);
        }
        var obtain = function(name) {
            if (name in secret) {
                return secret[name];
            } else {
                if (base) {
                    return base.obtain(name);
                } else {
                    return undefined;
                }
            }
        }
        var secret = {}
        var cls = { 'get' : get, 'set' : set , 'new' : n , attributes: attributes , 'secret' : secret , 'obtain' : obtain};
        return cls;
    },
    makeInstance : function(cls){
        var lookup = function(name) {
            if (name in attributes) {
                return attributes[name];
            } else {
                var val = cls.get(name);
                return bind(val, instance);
            }
        }
        var get = function(name) {
            try {
                return lookup(name);
            } catch (e) {
                if (cls.attributes.__getattr__) {
                    return cls.attributes.__getattr__(instance, name);
                } else {
                    throw(name+" NOT FOUND");
                }
            }
        }
        var set = function(name, value) {
            attributes[name] = value;
        }
        var obtain = function(name) {
            if (name in secret) {
                return secret[name];
            } else {
                return cls.obtain(name);
            }
        }
        var attributes = {};
        var secret = {};
        var instance = {
            'get' : get,
            'set' : set,
            'attributes' : attributes,
            'define' : function() {
            },
            'secret' : secret,
            'obtain' : obtain,
            'toString' : function() {
                return this.get('__str__')()
            },
            'call' : function() {
                if (this.obtain("callable")) {
                    return this.obtain('value').apply(this.obtain('value'), arguments);
                } else {
                    throw("NOT CALLABLE U FOOL");
                }
            }
        };
        return instance;
    }
}
var initInstance = function(cls, args) {
    instance = proxy.makeInstance(cls);
    init = cls.get('__init__');
    if (init) {
        var arr = [];
        arr.push(instance);
        for(var key in args) {
            arr.push(args[key]);
        }
        init.apply(init, arr);
    }
    return instance;
}
var bind = function(value, instance) {
    if (typeof(value) == "function") {
        var method = function() {
            var arr = [];
            arr.push(instance);
            for(var key in arguments) {
                arr.push(arguments[key]);
            }
            return value.apply(value, arr);
        }
        return method;
    } else {
        return value;
    }
}
var object = proxy.makeClass({
    "__str__" : function(self) {
        return "<type '"+self.get("_type")+"'>"
    }
}, null);
proxy.object = object;
module.exports = proxy;
