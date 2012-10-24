var Parser = function () {
    this.parse = function(data){
        var tokenizer = new Tokenizer(data);
        var tokens = tokenizer.tokens();
        return tokens;
    }
}
var SPLITS = {
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
    "!": {"!=" : false},
    "(":false,
    ")":false,
    "{":false,
    "}":false,
    "[":false,
    "]":false,
    ",":false,
    ":":false
}
var Tokenizer = function(text) {
    var TOKEN_SPLITS = { " " : false }
    var chunked = [];
    var build = "";
    text = text.trim();
    for (var i = 0; i < text.length; i++) {
        var char = text.charAt(i);
        var curOps = SPLITS;
        var token = char;
        curOps = SPLITS;
        if (token in curOps) {
            build = build.trim();
            if (build != "") {
                chunked.push(build);
                build = "";
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
            if (char in TOKEN_SPLITS) {
                build = build.trim();
                if (build != "") {
                    chunked.push(build);
                }
                build = "";
            } else {
                build += char;
            }
        }
    }
    //TODO we use this piece of code a lot. perhaps make some sort of token buffer class that does this for us
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
