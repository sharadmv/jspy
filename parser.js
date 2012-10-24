var Parser = function () {
    this.parse = function(data){
        var tokenizer = new Tokenizer(data);
        var tokens = tokenizer.tokens();
        return tokens;
    }
}

var Kinds = {
    DEF: 0,
    ID: 1,
    INDENT: 2,
    DEDENT: 3,
    OP: 4,
    IF: 5,
    ELSE: 6,
    ELIF: 7,
    ERR: 8
}

var Identifiers = {
    "def" : false,
    "if" : false,
    "else" : false,
    "elif" : false,
    "return" : false,
    "while" : false,
    "for" : false,
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
    var id_begin = /[A-Za-z_]/;
    var id_inside = /\w/;
    text = text.trim();
    var i = 0;
    var is_number = function(text) {
        return /[0-9]+/g.exec(text);
    }
    var current = function(){
        return text.charAt(i);
    }
    var consume = function(){
        var rval = text.charAt(i);
        i ++;
        return rval;
    }
    var accept = function(all_allowed){
        var char = text.charAt(i);
        var any = false;

        if(i - 1 == text.length){
            return false;
        }

        for(var j = 0; j < all_allowed.length; j ++){
            if(char == all_allowed.charAt(j)){
                build += char;
                i ++;
                char = text.charAt(i);
                any = true;
            }
        }
        return any;
    }
    var accept_regex = function(reg){
        if(i - 1 == text.length){
            console.log('done');
            return false;
        }
        var char = text.charAt(i);
        console.log('char is ', char);
        if(reg.exec(current())){
            console.log('yay');
            build += consume();
            return true;
        }
        return false;
    }
    for (; i < text.length; i++) {
        build = "";
        var curOps = SPLITS;
        var token = text.charAt(i);
        if (token in curOps) {
            do {
                curOps = curOps[token];
                var is_num = false;
                if (i+1 == text.length) {
                    break;
                } else {
                    var next = text.charAt(i+1)
                    if (curOps && token + next in curOps) {
                        token += next;
                    } else if(is_number(next)){
                        is_num = true;
                        break;
                    } else {
                        break;
                    }
                    i++;
                }
            } while (true);
            if(!is_num){
                chunked.push(token);
                continue;
            }
        }
        if (accept_regex(id_begin)){
            while(accept_regex(id_inside)){}
            console.log("build is ", build);
            if (build in Identifiers){
                chunked.push([build, Kinds[build.toUpperCase()]]);
            }
            else{
                chunked.push([build, Kinds.ID]);
            }
        }
        else if(is_number(token) || accept("+-")){

        } else{
            chunked.push([token, Kinds.ERR]);
        }
    }
    //TODO we use this piece of code a lot. perhaps make some sort of token buffer class that does this for us
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
