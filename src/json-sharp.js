'use strict';

var JSONSharp = {
    process: function (obj, context) {
        var isArrayOrObject = (typeof obj === 'object');
        if (!isArrayOrObject) {
            return obj;
        }

        var key, operation, options;
        var result = this._clone(obj);

        for (key in result) {
            if (!result.hasOwnProperty(key)) {
                continue;
            }

            operation = this.operations[key];
            if (operation !== undefined) {
                options = result[key];
                return this.process(this.operations[key](options, context), context);
            }
        }
        return result;
    },
    operations: {
        '#switch': function (obj, context) {
            var result;
            var value = context[obj['#property']];
            var options = obj['#case'];

            result = options[value];
            if (result !== undefined) {
                return result;
            }

            result = options['#default'];
            if (result !== undefined) {
                return result;
            }

            return undefined;
        }
    },
    _clone: function (obj) {
        return JSON.parse(JSON.stringify(obj));
    }
};

module.exports = {JSONSharp: JSONSharp};
