var Parser = function () {
    this.parse = function(data){
        var tokenizer = new Tokenizer(data);
        var tokens = tokenizer.tokens();
        return tokens;
    }
}
var OPERATORS = {
    "+":    2,
    "-":    2,
    "*":    3,
    "/":    3,
    "**":   1,
    "^": true,
    "&": true,
    "|": true,
    "~":    2,
    ">>": true,
    "<<": true,
    "%":    3,
    "//":   3,
    ">": true,
    "<": true,
    "=": true,
    ">=": true,
    "<=": true,
    "!=": true,
    "+=": true,
    "-=": true,
    "*=": true,
    "/=": true,
    "**=": true,
    "//=": true,
    "and": true,
    "or": true,
    "not": true,
    "in": true,
    "not in": true,
    "is": true,
    "is not": true,
}
var Tokenizer = function(text) {
    var TOKEN_SPLITS = { " " : true }
    var DELIMITER = { " " : true }
    var chunked = [];
    var build = "";
    for (var i = 0; i < text.length; i++) {
        var char = text.charAt(i);
        if (char in TOKEN_SPLITS) {
            if (build != "") {
                chunked.push(build);
            }
            chunked.push(char);
            build = "";
        } else if (char in DELIMITER) {
            if (build != "") {
                chunked.push(build);
            }
            build = "";
        }else {
            build += text.charAt(i);
        }
    }
    if (build != ""){
        chunked.push(build.trim());
    }
    build = "";
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
