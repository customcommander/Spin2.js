describe('spin.getPanel(elt)', function () {

    it('Returns the corresponding panel', function () {

        var home, elt;

        runs(AppHelper.restart);

        waitsFor(function () {
            home = document.getElementById('spin-panels').firstChild;
            return home;
        });

        waitsFor(function () {
            return !PanelHelper.isMoving(home);
        });

        runs(function () {
            elt = home.querySelector('#hammersmithandcity');
        });

        runs(function () {
            expect(spin.getPanel(0)).toBe(home);
            expect(spin.getPanel(home.id)).toBe(home);
            expect(spin.getPanel('hammersmithandcity')).toBe(home);
            expect(spin.getPanel(home)).toBe(home);
            expect(spin.getPanel(elt)).toBe(home);
        });
    });

    it('Throws an error if elt is not valid', function () {
        var badCallErr = new Error('bad function call');

        function badCall(arg) {
            return spin.getPanel.bind({}, arg);
        }

        expect(badCall()).toThrow(badCallErr);
        expect(badCall(null)).toThrow(badCallErr);
        expect(badCall(undefined)).toThrow(badCallErr);
        expect(badCall(false)).toThrow(badCallErr);
        expect(badCall(true)).toThrow(badCallErr);
        expect(badCall('')).toThrow(badCallErr);
        expect(badCall('   ')).toThrow(badCallErr);
        expect(badCall({})).toThrow(badCallErr);
        expect(badCall([])).toThrow(badCallErr);
        expect(badCall(function () {})).toThrow(badCallErr);
        expect(badCall(Infinity)).toThrow(badCallErr);
        expect(badCall(-Infinity)).toThrow(badCallErr);
        expect(badCall(NaN)).toThrow(badCallErr);
    });

    it('Throws an error if the corresponding panel is not found', function () {

        var notFoundErr = new Error('panel not found');

        function notFound(arg) {
            return spin.getPanel.bind({}, arg);
        }
        // These are valid calls but we expect them to fail
        expect(notFound(-200)).toThrow(notFoundErr);
        expect(notFound(200)).toThrow(notFoundErr);
        expect(notFound('unknown_id')).toThrow(notFoundErr);
        expect(notFound(document.body)).toThrow(notFoundErr);
        expect(notFound(document.documentElement)).toThrow(notFoundErr);
    });
});