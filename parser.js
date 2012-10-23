var Parser = function () {
    this.parse = function(data){
        var tokenizer = new Tokenizer(data);
        var tokens = tokenizer.tokens();
        return tokens;
    }
}
var OPERATORS = {
    "+": {"+=" : false},
    "-": {"-=" : false},
    "*": {"**" :
            {"**=" : false},
          "*=" : false
         },
    "/": {"//" :
            {"//=" : false},
          "/=" : false
         },
    "^": {"^=" : false},
    "&": {"&=" : false},
    "|": {"|=" : false},
    "~": false,
    ">": {">>" :
            { ">>=" : false},
          ">=" : false
         },
    "<": {"<<" :
            { "<<=" : false},
          "<=" : false
         },
    "%": {"%=" : false},
    "=": {"==" : false},
    "!=":false,
}
var Tokenizer = function(text) {
    var TOKEN_SPLITS = { " " : false }
    var chunked = [];
    var build = "";
    text = text.trim();
    for (var i = 0; i < text.length; i++) {
        var char = text.charAt(i);
        var curOps = OPERATORS;
        var token = char;
        curOps = OPERATORS;
        if (token in curOps) {
            build = build.trim();
            if (build != "") {
                chunked.push(build);
            }
            do {
                curOps = curOps[token];
                if (i+1 == text.length) {
                    break;
                } else {
                    var next = text.charAt(i+1)
                    if (curOps && token + next in curOps) {
                        token += next;
                    } else {
                        break;
                    }
                    i++;
                }
            } while (true);
            chunked.push(token);
        } else {
            build += char;
            if (token in TOKEN_SPLITS) {
                chunked.push(build);
                build = "";
            }
        }
    }
    build = build.trim();
    if (build != "") {
        chunked.push(build);
    }
    console.log(chunked);
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
