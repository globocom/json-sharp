/* global define */

'use strict';

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['deepmerge'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('deepmerge'));
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root.deepmerge);
    }
}(this, function (deepmerge) { /* jshint ignore:line */
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
            '#merge': function (obj) {
                return deepmerge.apply(deepmerge, obj);
            },
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

    return {JSONSharp: JSONSharp};
}));
