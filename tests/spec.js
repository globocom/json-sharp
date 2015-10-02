describe('json-sharp', function () {
    'use strict';

    var expect = require('chai').expect;
    var JSONSharp = require('../src/json-sharp').JSONSharp;

    describe('.process', function () {
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
            var obj = "str";
            var result = JSONSharp.process(obj, {});
            expect(result).to.be.equal(obj);
        });
    });
});
