// Internally spin.deleteAfter uses spin.getPanel to match a panel
// corresponding to "elt". Since this logic has been thoroughly tested
// already (see spin.getpanel.js) we're not covering it again.
describe('spin.deleteAfter(elt)', function (){

    var panel, timer;

    beforeEach(function () {
        var stop = true;

        runs(function () {
            panel = spin();
            timer = setTimeout(function () {
                stop = false;
            }, 2000);
        });

        waitsFor(function () {
            return !stop;
        }, 'Timeout!', 2500);
    });

    afterEach(function (){
        clearTimeout(timer);
    });

    it('Deletes all panels after corresponding panel', function () {
        var home = spin.getPanel(0);
        spin.deleteAfter(0);
        expect(home.nextSibling).toBeNull();
        expect(home.parentNode.lastChild).toBe(home);
        expect(document.getElementById(panel.id)).toBeNull();
    });

    it('Returns corresponding panel', function () {
        var home = spin.getPanel(0);
        expect(spin.deleteAfter(0)).toBe(home);
    });

    //TODO: make sur the last panel is visible
});