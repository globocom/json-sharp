'use strict';

var JSONSharp = {
    process: function (obj, context) {
        var result = this._clone(obj);
        return result;
    },
    _clone: function (obj) {
        return JSON.parse(JSON.stringify(obj));
    }
};

module.exports = {JSONSharp: JSONSharp};
