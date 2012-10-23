var Frame = function() {
    var env = {};
    this.set = function(name, value) {
        env[name] = value;
    }
    this.get = function(name) {
        return env[name];
    }
}
var Evaluator = function () {
    global = new Frame();
    this.eval = function(tokens, env){
        if (!env) {
            env = global;
        }
        var token = tokens.shift();
        stack = [];
        expr = [];
        while (token) {
            if (KEYWORDS[token]) {
                return (new (Expression[token])(tokens));
            } else {
                if (tokens[0] == "=") {
                    tokens.shift();
                    temp = this.eval(tokens);
                    env.set(token,temp);
                    return None;
                } else {
                    eval = evalToken(token);
                    val = eval[0];
                    type = eval[1];
                    if (type == "int" || type == "float") {
                        expr.push(eval);
                    }
                    if (type == "operator") {
                        while (stack.length != 0 && stack[stack.length-1][1]=="operator" && !priority(val, stack[stack.length-1][1])) {
                            expr.push(stack.pop());
                        }
                        stack.push(eval);
                    } else if (token == "(") {
                        stack.push(eval);
                    } else if (token == ")") {
                        temp = stack.pop();
                        while (temp[0] != "(") {
                            expr.push(temp);
                            temp = stack.pop();
                        }
                    }
                }

            }
            token = tokens.shift();
        }
        while (stack.length != 0) {
            expr.push(stack.pop());
        }
        return postfixEval(expr);
    }

    var priority = function(op1, op2) {
        if (op1 == "**"){
            return true;
        }
        if (op1 == "+" || op1 == "-") {
            if (op2 == "*" || op2 == "/") {
                return false;
            }
        }
        return true;
    }

    var postfixEval = function(expr) {
        tokens = expr;
        stack = [];
        for (t in tokens) {
            var token = tokens[t];
            var func;
            if (token[1] == "operator") {
                if (token[0] == "+") {
                    func = function(x,y){return x+y};
                }
                if (token[0] == "*") {
                    func = function(x,y){return x*y};
                }
                if (token[0] == "/") {
                    func = function(x,y){return x/y};
                }
                if (token[0] == "-") {
                    func = function(x,y){return x-y};
                }
                if (token[0] == "**") {
                    func = function(x,y){return pow(x,y)};
                }
                var first = stack.pop()[0];
                var second = stack.pop()[0];
                stack.push([func(second, first),'float'])
            }
            if (token[1] == "int" || token[1] == "float"){
                stack.push(token);
            }
        }
        return stack.pop()[0];
    }

    var isAtom = function() {
    }

    var evalToken = function(token) {
        if (!isNaN(parseFloat(token)) || token.match(/[0-9]+[.][0-9]+/g)) {
            return [parseFloat(token), "float"];
        } else if (!isNaN(parseInt(token)) || token.match(/[0-9]+/g)) {
            return [parseInt(token), "int"];
        } else if (token.match(/[0-9]+[.][0-9]+/g)) {
            return [parseFloat(token), "float"];
        } else if (token.match(/[+*-/]/g) || token == "**") {
            return [token, "operator"];
        } else if (token == "(" || token == ")"){
            return [token, "parentheses"];
        } else {
            var get = global.get(token);
            if (get !== undefined) {
                return evalToken(get);
            }
            throw(token+" not found!");
        }
    }

    var isValid = function(tokens) {
        var token = tokens.shift();
        while (token) {
            if (KEYWORDS[token]) {
                var expr = new (KEYWORDS[token])(tokens);
            } else {
            }
            token = tokens.shift();
        }
        return true;
    }
}
var Expression = {
    "def" : function(tokens) {
        this.name = tokens.shift()
        this.formals = [];
        tokens.shift()
        formal = tokens.shift()
        while (formal != ")") {
            if (formal != ",") {
                this.formals.push(formal);
            }
            formal = tokens.shift();
        }
    }
}
var KEYWORDS = {
    "def" : true
}
var None = undefined;
module.exports = Evaluator;
