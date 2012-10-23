var parser = new (require('./parser.js'))();

var Reader = function() {
    var callback;
    this.read = function(cb) {
        callback = cb;
        process.stdout.write(">>> ");
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
    }
    process.stdin.on('data', function (data) {
        callback(data);
    });
    this.print = function(message) {
        if (message != undefined)
            process.stdout.write(message+"\n");
    }
}
module.exports = Reader;
