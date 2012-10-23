var Util = {
    Delimiter : function(delimiter, pre, post) {
        this.join = function(arr) {
            return pre+arr.join(delimiter)+post;
        }
    }
}
module.exports = Util;
