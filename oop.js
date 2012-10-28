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
        var cls = { 'get' : get, 'set' : set , 'new' : n , attributes: attributes };
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
        var attributes = {};
        var instance = { attributes : attributes, 'get' : get, 'set' : set , toString: function() {return this.get('__str__')()}};
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
