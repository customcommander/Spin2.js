// Expected behaviour for spin.loader
describe('spin.loader([fn])', function () {

    describe('If fn is not passed', function () {
        it('Returns the current loader', function () {
            expect(spin.loader()).toBe(spin.xhrLoader);
        });
    });

    describe('If fn is passed', function (){

        // Make sure we restore the default loader after the tests
        afterEach(function () {
            spin.loader(spin.xhrLoader);
        });

        // Should do that
        it('Replaces the current loader with that function', function () {
            var noop = jasmine.createSpy('noop');
            spin.loader(noop);
            clickNav('nav1');
            expect(noop).toHaveBeenCalled();
        });

        // And that
        it('Returns the previous loader', function () {
            var prevLoader = spin.loader();
            function noop() {}
            expect(spin.loader(noop)).toBe(prevLoader);
        });
    });

    describe('If fn is passed and is not a function', function () {

        it('Throws an error', function () {
            var err = new Error("bad function call");

            function loader(arg) {
                return spin.loader.bind({}, arg);
            }

            // Possible and edge cases
            expect(loader(null)).toThrow(err);
            expect(loader(undefined)).toThrow(err);
            expect(loader(false)).toThrow(err);
            expect(loader(true)).toThrow(err);
            expect(loader(999)).toThrow(err);
            expect(loader(-999)).toThrow(err);
            expect(loader(Infinity)).toThrow(err);
            expect(loader(-Infinity)).toThrow(err);
            expect(loader('')).toThrow(err);
            expect(loader("     ")).toThrow(err);
            expect(loader(NaN)).toThrow(err);
            expect(loader([])).toThrow(err);
            expect(loader({})).toThrow(err);
        });
    });
});