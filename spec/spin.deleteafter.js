// Internally spin.deleteAfter uses spin.getPanel to match a panel
// corresponding to "elt". Since this logic has been thoroughly tested
// already (see spin.getpanel.js) we're not covering it again.
describe('spin.deleteAfter(elt)', function () {

    beforeEach(function () {
        runs(function () {
            AppHelper.restart();
        });
        waitsFor(pause(2000));
    });

    it('Returns corresponding panel', function () {
        var home = spin.getPanel(0);
        expect(spin.deleteAfter(0)).toBe(home);
    });

    it('Deletes all panels after corresponding panel', function () {
        runs(function () {
            AppHelper.clickNav('hammersmithandcity');
        });
        waitsFor(pause(2000));
        runs(function () {
            var home   = spin.getPanel(0),
                panels = document.getElementById('spin-panels');
            spin.deleteAfter(home);
            expect(panels.firstChild).toBe(panels.lastChild);
            expect(panels.firstChild).toBe(home);
            expect(home).toBeSmall();
        });
    });
});