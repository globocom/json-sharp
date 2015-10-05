/* global before, after */

describe('json-sharp', function () {
    'use strict';

    var expect = require('chai').expect;
    var JSONSharp = require('../src/json-sharp').JSONSharp;

    describe('.process', function () {
        before(function () {
            JSONSharp.operations['#dummy'] = function(obj){
                return {dummy: obj};
            };
        });

        after(function () {
            delete JSONSharp.operations['#dummy'];
        });

        it('should clone the original object', function () {
            var obj = {a: 'a'};
            var result = JSONSharp.process(obj, {});
            expect(result).to.be.deep.equal(obj);
            expect(result).to.not.equal(obj);
        });

        it('should clone the original array', function () {
            var obj = [1];
            var result = JSONSharp.process(obj, {});
            expect(result).to.be.deep.equal(obj);
            expect(result).to.not.equal(obj);
        });

        it('should return the value when it is not an array or object', function () {
            var obj = 'str';
            var result = JSONSharp.process(obj, {});
            expect(result).to.be.equal(obj);
        });

        it('should process operations in objects', function () {
            var obj = {
                prop: {'#dummy': 'dummy'}
            };
            var result = JSONSharp.process(obj, {});
            expect(result).to.be.deep.equal({prop: {dummy: 'dummy'}});
        });

        it('should process operations in arrays', function () {
            var obj = [
                {'#dummy': 'dummy'}
            ];
            var result = JSONSharp.process(obj, {});
            expect(result).to.be.deep.equal([{dummy: 'dummy'}]);
        });
    });

    describe('#switch', function () {
        var baseObj = {
            '#switch': {
                '#property': 'option',
                '#case': {
                    a: 'AAA',
                    b: 'BBB',
                }
            }
        };

        beforeEach(function () {
            this.obj = JSONSharp._clone(baseObj);
        });

        it('should return matching value', function () {
            var context = {option: 'a'};
            var result = JSONSharp.process(this.obj, context);
            expect(result).to.be.deep.equal('AAA');
        });

        it('should fallback to default value', function () {
            this.obj['#switch']['#case']['#default'] = 'CCC';
            var context = {option: '???'};
            var result = JSONSharp.process(this.obj, context);
            expect(result).to.be.deep.equal('CCC');
        });

        it('should return undefined when there is no fallback', function () {
            var context = {option: '???'};
            var result = JSONSharp.process(this.obj, context);
            expect(result).to.be.undefined;
        });

        it('should process nested operations', function () {
            var nested = {
                '#switch': {
                    '#property': 'option',
                    '#case': {
                        a: 'AAA',
                        b: 'BBB',
                        c: {'#switch': {'#property': 'otherOption', '#case': {
                            cc: 'CCC'
                        }}}
                    }
                }
            };

            var context = {option: 'c', otherOption: 'cc'};
            var result = JSONSharp.process(nested, context);
            expect(result).to.deep.equal('CCC');
        });
    });

    describe('#merge', function () {
        it('should merge multiple objects', function () {
            var obj = {
                '#merge': [
                    {a: 'aaa'},
                    {b: 'bbb'},
                ]
            };

            var result = JSONSharp.process(obj, {});
            expect(result).to.deep.equal({a: 'aaa', b: 'bbb'});
        });

        it('should deeply merge objects', function () {
            var obj = {
                '#merge': [
                    {a: {aa: 'aaa'}},
                    {a: {bb: 'bbb'}},
                ]
            };

            var result = JSONSharp.process(obj, {});
            expect(result).to.deep.equal({a: {aa: 'aaa', bb: 'bbb'}});
        });
    });
});
