var reader = new (require('./repl.js'))();
var parser = new (require('./parser.js'))();
var evaluator = new (require('./evaluate.js'))();

(function read() {
    reader.read(function(data) {
        var tokens = parser.parse(data);
        try {

            var ret = evaluator.eval(tokens);
        } catch (e) {
            console.log(e);
        }
        reader.print(ret);
        read();
    });
})();
