// Internally spin.moveTo uses spin.getPanel to match a panel corresponding
// to "elt". This is thoroughly tested in spin.getpanel.js already.
describe('spin.moveTo(elt)', function () {
    it('Returns the corresponding panel', function () {
        var home = spin.getPanel(0);
        expect(spin.moveTo(0)).toBe(home);
    });
});