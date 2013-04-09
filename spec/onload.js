/*
 * Describes the expectations when page has finished to load.
 */
describe('On page load', function () {

    /*
     * Ensures that Spin.js API is there.
     */
    it('Spin is available', function () {
        expect(window.spin).toBeFunction();
        expect(window.spin.getPanel).toBeFunction();
        expect(window.spin.getPanelState).toBeFunction();
        expect(window.spin.moveTo).toBeFunction();
        expect(window.spin.deleteAfter).toBeFunction();
    });

    it('Spin panel states are defined', function () {
        expect(window.spin.PANEL_HIDDENRIGHT).toBe('hiddenright');
        expect(window.spin.PANEL_HIDDENLEFT).toBe('hiddenleft');
        expect(window.spin.PANEL_FULL).toBe('full');
        expect(window.spin.PANEL_BIG).toBe('big');
        expect(window.spin.PANEL_SMALL).toBe('small');
    });

    /*
     * Spin.js should have dropped its markup on the page.
     *
     *  <body>
     *      <div id="spin">
     *          <div id="spin-nav"></div>
     *          <div id="spin-panels"></div>
     *      </div>
     *  </body>
     */
    it('Spin markup has been dropped', function () {
        var spinElt       = document.getElementById('spin'),
            spinNavElt    = document.getElementById('spin-nav'),
            spinPanelsElt = document.getElementById('spin-panels');

        expect(spinElt).toBeDefined();
        expect(spinNavElt).toBeDefined();
        expect(spinPanelsElt).toBeDefined();
        expect(spinElt.parentNode).toBe(document.body);
        expect(spinElt.childNodes.length).toBe(2);
        expect(spinElt.childNodes[0]).toBe(spinNavElt);
        expect(spinElt.childNodes[1]).toBe(spinPanelsElt);
    });

    /*
     * Spin.js should load the first panel (home panel).
     */
    it('Home panel has loaded', function () {

        // Waits for the panel to arrive
        waitsFor(AppHelper.getHome, 'Timeout', 1000);

        runs(function () {
            var home = AppHelper.getHome();
            expect(home).toBecomeFull('spin-hiddenright');
        });

        // Waits for animation to finish
        waitsFor(AppHelper.notMoving);

        runs(function () {
            var home = AppHelper.getHome();
            expect(home).toBeFull();
        });
    });
});
