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
});