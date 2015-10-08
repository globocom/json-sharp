/*
 *  json-sharp - v0.1.0
 *  Process operations on pure JSON objects
 *
 *  Made by Globo.com
 *  Under MIT License
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.deepmerge = factory();
    }
}(this, function () {

return function deepmerge(target, src) {
    var array = Array.isArray(src);
    var dst = array && [] || {};

    if (array) {
        target = target || [];
        dst = dst.concat(target);
        src.forEach(function(e, i) {
            if (typeof dst[i] === 'undefined') {
                dst[i] = e;
            } else if (typeof e === 'object') {
                dst[i] = deepmerge(target[i], e);
            } else {
                if (target.indexOf(e) === -1) {
                    dst.push(e);
                }
            }
        });
    } else {
        if (target && typeof target === 'object') {
            Object.keys(target).forEach(function (key) {
                dst[key] = target[key];
            })
        }
        Object.keys(src).forEach(function (key) {
            if (typeof src[key] !== 'object' || !src[key]) {
                dst[key] = src[key];
            }
            else {
                if (!target[key]) {
                    dst[key] = src[key];
                } else {
                    dst[key] = deepmerge(target[key], src[key]);
                }
            }
        });
    }

    return dst;
}

}));

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
            var clone = this._clone(obj);
            return this.processNode(clone, context);
        },
        processNode: function (obj, context) {
            var objType = Object.prototype.toString.call(obj);
            var isArray = (objType === '[object Array]');
            var isObject = (objType === '[object Object]');

            if (isObject) {
                return this.processObject(obj, context);
            }
            else if (isArray) {
                return this.processArray(obj, context);
            }
            else {
                return obj;
            }
        },
        processObject: function (obj, context) {
            var key, operation;

            operation = this.getOperation(obj);
            if (operation !== undefined) {
                return operation.func(this.processNode(obj[operation.name], context), context);
            }

            for (key in obj) {
                if (!obj.hasOwnProperty(key)) {
                    continue;
                }

                obj[key] = this.processNode(obj[key], context);
            }

            return obj;
        },
        processArray: function (obj, context) {
            for (var i = 0; i < obj.length; i++) {
                obj[i] = this.processNode(obj[i], context);
            }
            return obj;
        },
        getOperation: function (obj) {
            for (var key in this.operations) {
                if (this.operations.hasOwnProperty(key) && obj.hasOwnProperty(key)) {
                    return {name: key, func: this.operations[key]};
                }
            }
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
