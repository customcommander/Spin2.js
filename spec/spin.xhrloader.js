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

    it('Throws an error if elt has not url', function () {

        var noUrlErr = new Error('element has no url'),
            elts;

        elts = document.createElement('ol');
        elts.innerHTML = [
            '<li id="test1">no data-url</li>',
            '<li id="test2" data-url="">empty data-url</li>',
            '<li id="test3" data-url="  ">white space only data-url</li>'
        ].join('');

        function noUrl(elt) {
            return spin.xhrLoader.bind({}, elt);
        }

        expect(noUrl(elts.querySelector('#test1'))).toThrow(noUrlErr);
        expect(noUrl(elts.querySelector('#test2'))).toThrow(noUrlErr);
        expect(noUrl(elts.querySelector('#test3'))).toThrow(noUrlErr);
    });
});