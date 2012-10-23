var Parser = function () {
    this.parse = function(data){
        var tokenizer = new Tokenizer(data);
        var tokens = tokenizer.tokens();
        return tokens;
    }
}
var OPERATORS = {
    "+": {"+=" : true},
    "-": {"-=" : true},
    "*": {"**" :
            {"**=" : true},
          "*=" : true
         },
    "/": {"//" :
            {"//=" : true},
          "/=" : true
         },
    "^": {"^=" : true},
    "&": {"&=" : true},
    "|": {"|=" : true},
    "~": true,
    ">": {">>" :
            { ">>=" : true},
          ">=" : true
         },
    "<": {"<<" :
            { "<<=" : true},
          "<=" : true
         },
    "%": {"%=" : true},
    "=": {"==" : true},
    "!=":true,
    "and":true,
    "or": true,
    "not":true,
    "in": true,
    "is":true
}
var Tokenizer = function(text) {
    var TOKEN_SPLITS = { " " : true }
    var chunked = [];
    var build = "";
    text = text.trim();
    for (var i = 0; i < text.length; i++) {
        var char = text.charAt(i);
        var curOps = OPERATORS;
        var token = char;
        curOps = OPERATORS;
        if (token in curOps) {
            do {
                if (i+1 == text.length) {
                    break;
                } else {
                    var next = text.charAt(i+1)
                    if (!(next in curOps)) {
                        break;
                    }
                    token += next;
                }
                i++;
                curOps = OPERATORS[token];
            } while (curOps && token in curOps);
        }
        if (!(token in TOKEN_SPLITS)) {
            chunked.push(token);
        }
    }
    var length = chunked.length;
    var index = 0;
    var next = function() {
        if (index == length) {
            return null;
        }
        var token = chunked[index];
        index++;
        return token;
    }

    this.tokens = function() {
        return chunked;
    }
}
module.exports = Parser;
