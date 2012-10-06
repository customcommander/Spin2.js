describe('spin.xhrLoader(elt)', function (){

    it('Throws an error if elt is not an html element', function () {

        var badCallErr = new Error('bad function call');

        function badCall(arg) {
            return spin.xhrLoader.bind({}, arg);
        }

        // Edge cases but easy to test...
        expect(badCall()).toThrow(badCallErr);
        expect(badCall(null)).toThrow(badCallErr);
        expect(badCall(undefined)).toThrow(badCallErr);
        expect(badCall(0)).toThrow(badCallErr);
        expect(badCall(1)).toThrow(badCallErr);
        expect(badCall(-1)).toThrow(badCallErr);
        expect(badCall(true)).toThrow(badCallErr);
        expect(badCall(false)).toThrow(badCallErr);
        expect(badCall(NaN)).toThrow(badCallErr);
        expect(badCall(Infinity)).toThrow(badCallErr);
        expect(badCall(-Infinity)).toThrow(badCallErr);
        expect(badCall([])).toThrow(badCallErr);
        expect(badCall({})).toThrow(badCallErr);
        expect(badCall(function () {})).toThrow(badCallErr);
        expect(badCall(new function () {})).toThrow(badCallErr);
        expect(badCall("")).toThrow(badCallErr);
        expect(badCall(" ")).toThrow(badCallErr);
        expect(badCall("\n\t")).toThrow(badCallErr);
    });
});