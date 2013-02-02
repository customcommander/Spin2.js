describe('spin.deleteAfter(elt)', function () {

    var home;

    beforeEach(function () {
        runs(AppHelper.restart);

        waitsFor(function () {
            home = document.getElementById('spin-panels').firstChild;
            return home;
        });

        waitsFor(AppHelper.notMoving);
    });

    it('Returns corresponding panel', function () {
        expect(spin.deleteAfter(home)).toBe(home);
    });

    it('Deletes all panels after corresponding panel', function () {

        var newpanel;

        runs(function () {
            AppHelper.clickNav('hammersmithandcity');
        });

        waitsFor(function () {
            newpanel = home.nextSibling;
            return newpanel;
        });

        waitsFor(AppHelper.notMoving);

        runs(function () {
            var panels = document.getElementById('spin-panels');
            spin.deleteAfter(home);
            expect(panels.childNodes.length).toBe(1);
            expect(panels.firstChild).toBe(home);
            expect(home).toBeSmall();
        });
    });
});