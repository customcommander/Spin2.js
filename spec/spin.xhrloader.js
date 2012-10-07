describe('spin.xhrLoader(elt)', function () {

    it('Loads the elt', function () {
        var lastpanel = document.getElementById('spin-panels').lastChild,
            newpanel;

        // Loads the tube map
        runs(function () {
            spin.xhrLoader(document.body);
        });

        // Waits for the map to arrive
        waitsFor(function () {
            newpanel = lastpanel.nextSibling;
            return newpanel;
        }, 'panel has taken too long to load', 1000);

        // Waits for animation to finish
        waitsFor(pause(2000));

        // Test if the content is what we expect.
        // Tube map should have an navigable element with the following id
        runs(function () {
            expect(newpanel.querySelector('#hammersmithandcity')).toBeDefined();
        });
    });

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

    it('Throws an error if elt has no url', function () {

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

    describe('Working out panel title', function () {

        it('Taken from data-title attribute', function () {
            var html, nav;

            runs(function () {
                html = document.createElement('div');
                html.innerHTML = '<li id="nav" data-url="panel.tubemap.html" data-title="Tube Map"></li>';
                nav = html.querySelector('#nav');
                spin.xhrLoader(nav);
            });

            // Waits for loading and animation to finish
            waitsFor(pause(3000));

            runs(function () {
                var panel = document.getElementById('spin-panels').lastChild;
                expect(PanelHelper.getTitle(panel)).toBe('Tube Map');
            });
        });

        it('Taken from the first .spin-title element', function () {
            var html, nav;

            runs(function () {
                html = document.createElement('div');
                html.innerHTML = '<li id="nav" data-url="panel.tubemap.html">'
                               +    '<p><span class="spin-title">Tube Map</span></p>'
                               +    '<p><span class="spin-title">Dont take it</span></p>'
                               + '</li>';
                nav = html.querySelector('#nav');
                spin.xhrLoader(nav);
            });

            // Waits for loading and animation to finish
            waitsFor(pause(3000));

            runs(function () {
                var panel = document.getElementById('spin-panels').lastChild;
                expect(PanelHelper.getTitle(panel)).toBe('Tube Map');
            });
        });

        it('Taken from the content', function () {
            var html, nav;

            runs(function () {
                html = document.createElement('div');
                html.innerHTML = '<li id="nav" data-url="panel.tubemap.html">'
                               +    '<p><span>Tube </span></p>'
                               +    '<p><span>Map</span></p>'
                               + '</li>';
                nav = html.querySelector('#nav');
                spin.xhrLoader(nav);
            });

            // Waits for loading and animation to finish
            waitsFor(pause(3000));

            runs(function () {
                var panel = document.getElementById('spin-panels').lastChild;
                expect(PanelHelper.getTitle(panel)).toBe('Tube Map');
            });
        });
    });
});