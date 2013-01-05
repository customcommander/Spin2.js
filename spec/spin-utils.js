describe('Spin utils functions', function () {

    describe('spin.isNumber(o)', function () {

        it('Returns true for numbers', function () {
            expect(spin.isNumber(0)).toBe(true);
            expect(spin.isNumber(1)).toBe(true);
            expect(spin.isNumber(-1)).toBe(true);
            expect(spin.isNumber(100)).toBe(true);
            expect(spin.isNumber(-100)).toBe(true);
        });

        it('Returns false for everything else', function () {
            expect(spin.isNumber()).toBe(false);
            expect(spin.isNumber(null)).toBe(false);
            expect(spin.isNumber(undefined)).toBe(false);
            expect(spin.isNumber(NaN)).toBe(false);
            expect(spin.isNumber(Infinity)).toBe(false);
            expect(spin.isNumber(-Infinity)).toBe(false);
            expect(spin.isNumber(true)).toBe(false);
            expect(spin.isNumber(false)).toBe(false);
            expect(spin.isNumber({})).toBe(false);
            expect(spin.isNumber(new Object())).toBe(false);
            expect(spin.isNumber([])).toBe(false);
            expect(spin.isNumber(new Array())).toBe(false);
            expect(spin.isNumber("")).toBe(false);
            expect(spin.isNumber("foobar")).toBe(false);
            expect(spin.isNumber("-1")).toBe(false);
            expect(spin.isNumber("0")).toBe(false);
            expect(spin.isNumber("1")).toBe(false);
            expect(spin.isNumber("10")).toBe(false);
            expect(spin.isNumber(function () {})).toBe(false);
            expect(spin.isNumber(new function () {})).toBe(false);
            expect(spin.isNumber(document.body)).toBe(false);
        });
    });

    describe('spin.isFunction(o)', function () {

        it('Returns true for functions', function () {
            function foo() {}
            expect(spin.isFunction(foo)).toBe(true);
            expect(spin.isFunction(function () {})).toBe(true);
            expect(spin.isFunction(new Function('return true;'))).toBe(true);
        });

        it('Returns false for everything else', function () {
            expect(spin.isFunction()).toBe(false);
            expect(spin.isFunction(null)).toBe(false);
            expect(spin.isFunction(undefined)).toBe(false);
            expect(spin.isFunction(NaN)).toBe(false);
            expect(spin.isFunction(Infinity)).toBe(false);
            expect(spin.isFunction(-Infinity)).toBe(false);
            expect(spin.isFunction(-1)).toBe(false);
            expect(spin.isFunction(1)).toBe(false);
            expect(spin.isFunction(0)).toBe(false);
            expect(spin.isFunction(-100)).toBe(false);
            expect(spin.isFunction(100)).toBe(false);
            expect(spin.isFunction(true)).toBe(false);
            expect(spin.isFunction(false)).toBe(false);
            expect(spin.isFunction("")).toBe(false);
            expect(spin.isFunction("hello")).toBe(false);
            expect(spin.isFunction("0")).toBe(false);
            expect(spin.isFunction("1")).toBe(false);
            expect(spin.isFunction("-10")).toBe(false);
            expect(spin.isFunction("100")).toBe(false);
            expect(spin.isFunction([])).toBe(false);
            expect(spin.isFunction(new Array())).toBe(false);
            expect(spin.isFunction({})).toBe(false);
            expect(spin.isFunction(new Object())).toBe(false);
        });
    });

    describe('spin.isObject(o)', function () {

        it('Returns true for objects', function () {
            expect(spin.isObject({})).toBe(true);
            expect(spin.isObject(new Object())).toBe(true);
            expect(spin.isObject(new function () {})).toBe(true);
        });

        it('Returns false for everything else', function () {
            expect(spin.isObject()).toBe(false);
            expect(spin.isObject(null)).toBe(false);
            expect(spin.isObject(undefined)).toBe(false);
            expect(spin.isObject(NaN)).toBe(false);
            expect(spin.isObject(Infinity)).toBe(false);
            expect(spin.isObject(-Infinity)).toBe(false);
            expect(spin.isObject(-1)).toBe(false);
            expect(spin.isObject(1)).toBe(false);
            expect(spin.isObject(0)).toBe(false);
            expect(spin.isObject(-100)).toBe(false);
            expect(spin.isObject(100)).toBe(false);
            expect(spin.isObject(true)).toBe(false);
            expect(spin.isObject(false)).toBe(false);
            expect(spin.isObject("")).toBe(false);
            expect(spin.isObject("hello")).toBe(false);
            expect(spin.isObject("0")).toBe(false);
            expect(spin.isObject("1")).toBe(false);
            expect(spin.isObject("-10")).toBe(false);
            expect(spin.isObject("100")).toBe(false);
            expect(spin.isObject([])).toBe(false);
            expect(spin.isObject(new Array())).toBe(false);
            expect(spin.isObject(function () {})).toBe(false);
            expect(spin.isObject(new Function('return true;'))).toBe(false);
        });
    });

    describe('isString(o)', function () {

        it('Returns true for strings', function () {
            expect(spin.isString("")).toBe(true);
            expect(spin.isString(new String(""))).toBe(true);
            expect(spin.isString("\r\n")).toBe(true);
            expect(spin.isString(new String("\r\n"))).toBe(true);
            expect(spin.isString("foo")).toBe(true);
            expect(spin.isString(new String("foo"))).toBe(true);
            expect(spin.isString("0")).toBe(true);
            expect(spin.isString(new String("0"))).toBe(true);
            expect(spin.isString("1")).toBe(true);
            expect(spin.isString(new String("1"))).toBe(true);
        });

        it('Returns false for everything else', function () {
            expect(spin.isString()).toBe(false);
            expect(spin.isString(null)).toBe(false);
            expect(spin.isString(undefined)).toBe(false);
            expect(spin.isString(NaN)).toBe(false);
            expect(spin.isString(Infinity)).toBe(false);
            expect(spin.isString(-Infinity)).toBe(false);
            expect(spin.isString(-1)).toBe(false);
            expect(spin.isString(1)).toBe(false);
            expect(spin.isString(0)).toBe(false);
            expect(spin.isString(-100)).toBe(false);
            expect(spin.isString(100)).toBe(false);
            expect(spin.isString(true)).toBe(false);
            expect(spin.isString(false)).toBe(false);
            expect(spin.isString([])).toBe(false);
            expect(spin.isString(new Array())).toBe(false);
            expect(spin.isString({})).toBe(false);
            expect(spin.isString(new Object())).toBe(false);
            expect(spin.isString(function () {})).toBe(false);
            expect(spin.isString(new Function('return true;'))).toBe(false);
            expect(spin.isString(document.body)).toBe(false);
        });
    });
});