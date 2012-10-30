var Parser = function () {
    var nextTok = null;
    var tokenizer = null;
    var getNext = function(){
        if(nextTok === null){
            nextTok = tokenizer.next();
        }
        return nextTok;
    }
    var consume = function(){
        var temp = nextTok;
        nextTok = null;
        return temp;
    }
    var accept = function(typ){
        if(getNext().typ === typ){
            consume();
            return true;
        }
        return false;
    }
    var expect = function(typ){
        if(getNext().typ === typ){
            consume();
            return;
        }
        throw new SyntaxError("Unexpected token " + getNext() + ". Wanted " + typ);
    }
    var parse = function(data){
        tokenizer = new Tokenizer(data);
        return parseStmt();
    }
    var parseStmt = function(){
        return;
    }
    var parseSimple = function(){
        return;
    }
    var parseSmall = function(){
        return;
    }
    var parseExprStmt = function(){
        return;
    }
    var parseTestList = function(){
        test = parseTest();
        if(accept(",")){
            test = [test]
            do{
                test.append(parseTest());
            }while(accept(","))
        }
    }
    var parseTest = function(){
        return;
    }
    var parseCompound = function(){
        return;
    }
}

var Kinds = {
    ID: 1,
    INDENT: 2,
    DEDENT: 3,
    OP: 4,
    LITERAL:5,
    DELIM: 6,
    NEWLINE: 7,
    KEYWORD: 8,
}

var Keywords = {
    "def" : false,
    "if" : false,
    "else" : false,
    "elif" : false,
    "return" : false,
    "while" : false,
    "for" : false,
}

var Delims = {
    "(" : false,
    ")" : false,
    ":" : false,
    "[" : false,
    "]" : false,
    "{" : false,
    "}" : false,
    "." : false
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
    var build = "";
    var id_begin = /[A-Za-z_]/;
    var id_inside = /\w/;
    var is_number = /[0-9]/;
    var is_hex = /[0-9A-Fa-f]/;
    var seen_char;
    var indent_stack = [0];
    text = text.trim();
    var i = 0;
    var res;
    var current = function(){
        return text.charAt(i);
    }

    var _next = function(){
        return text.charAt(i + 1);
    }
    var consume = function(){
        var rval = text.charAt(i);
        i ++;
        return rval;
    }

    var emit = function(type){
        console.log("Emitting " + build);
        if(!(/\s/.exec(build))){
            seen_char = true;
        }
        res = {content: build, typ: type};
    }

    var accept = function(reg){
        if(i - 1 === text.length){
            console.log('done');
            return false;
        }
        var char = text.charAt(i);
        if(reg.exec(current())){
            build += consume();
            return true;
        }
        return false;
    }
    var accept_run = function(reg){
        var rval = false;
        while(accept(reg)){
            rval = true;
        }
        return rval;
    }

    var count_spaces = function(str){
        var count = 0;
        for(; count < str.length && str.charAt(count) === " "; count ++){}
        return count;
    }

    var indent_level = function(){
        var level = 0;
        for(var i = 0; i < indent_stack.length; i ++){
            level += indent_stack[i];
        }
        return level;
    }

    var deal_with_indent = function(){
        var front = build;
        while(build.indexOf('\t') > 0){
            var spaces = " ";
            var temp;
            var count = -1;
            while (count % 8 != 0 && spaces.length < 9){
                temp = build.replace('\t', spaces);
                spaces += " ";
                count = count_spaces(temp);
            }
            front = temp;
        }
        current_indent = indent_stack[indent_stack.length-1];
        if(front.length > current_indent){
            indent_stack.push(front.length - current_indent);
            emit(Kinds.INDENT);
        } else if(front.length < current_indent){
            var back = indent_stack.pop();
            var num_dedent = 0;
            while(back_val != 0 && indent_level() > len_curr){
                back_val = indent_stack.pop();
                num_dedent++;
            }
            if (indent_level() < front.length){
                throw new SyntaxError("Bad indent.");
            }
            while (num_dedent > 0){
                emit(Kinds.DEDENT);
                num_dedent --;
            }
        }
    }

    var next = function(){
        build = "";
        console.log("processing " + current());
        var curOps = SPLITS;
        if (current() in curOps) {
            consume();
            do {
                curOps = curOps[current()];
                var is_num = false;
                if (i+1 === text.length) {
                    break;
                } else {
                    if (curOps && token + _next() in curOps) {
                        consume();
                    } else{
                        if(is_number.exec(_next())){
                            is_num = true;
                        }
                        break;
                    }
                }
            } while (true);
            if(!is_num){
                emit(Kinds.OP);
                continue;
            }
        }
        if (current() in SpecialCharacters){
            var temp = consume();
            emit(Kinds[SpecialCharacters[temp]]);
        }
        else if (accept(id_begin)){
            while(accept(id_inside)){}
            console.log("build is ", build);
            if (build in Keywords){
                emit(Kinds[build.toUpperCase()]);
            }
            else{
                emit(Kinds.ID);
            }
        }
        else if(is_number.exec(current()) || accept(/[+-~]/)){
            var reg = is_number;
            var type = Kinds.INT;
            if (accept(/0/) && accept(/[xX]/)){
                reg = is_hex;
            }
            accept_run(reg);
            if(accept(/\./)){
                type = Kinds.FLOAT;
                if (!accept(reg)){
                    throw new SyntaxError("Unexpected period");
                    i = text.length;
                }
                else{
                    accept_run(reg);
                }
            }

            if(accept(/[eE]/)){
                type = Kinds.FLOAT;
                accept(/[+-]/);
                accept_run(reg);
            }
            emit(type);
        }
        else if(/\s/.exec(current())){
            switch (consume()) {
                case '\n':
                    seen_char = false;
                    emit(Kinds.EOL)
                    break;
                case '\t':
                    if(!seen_char){
                        deal_with_indent();
                    }
            }
        } else{
            throw new SyntaxError("Unexpected token " + current());
        }
        return res;
    }
    this.next = next;
}

module.exports = Parser;
