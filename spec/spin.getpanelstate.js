describe('spin.getPanelState(elt)', function () {

    /*
     * This test is a bit long as we describe a user interaction with the application.
     * User interaction scenario:
     */
    it('Returns the current state of a panel', function () {

        var panel0,
            panel1,
            panel2;

        // Fresh start
        runs(AppHelper.restart);

        // Waits for the home panel to load
        waitsFor(function () {
            panel0 = document.getElementById('spin-panels').firstChild;
            return panel0;
        });

        // Waits for the home panel to stop moving
        waitsFor(function () {
            return !PanelHelper.isMoving(panel0);
        });

        // Test 1
        // Home panel should be full
        runs(function () {
            expect(spin.getPanelState(panel0)).toBe(spin.PANEL_FULL);
        });

        // Calls the second panel
        runs(function () {
            AppHelper.clickNav('hammersmithandcity');
        });

        // Waits for second panel to load
        waitsFor(function () {
            panel1 = panel0.nextSibling;
            return panel1;
        });

        // Waits for the panels to stop moving
        waitsFor(function () {
            return !PanelHelper.isMoving(panel0)
                && !PanelHelper.isMoving(panel1);
        });

        // Test 2
        // Home should be minimized and the second panel maximized
        runs(function () {
            expect(spin.getPanelState(panel0)).toBe(spin.PANEL_SMALL);
            expect(spin.getPanelState(panel1)).toBe(spin.PANEL_BIG);
        });

        // Calls the third panel
        runs(function () {
            AppHelper.clickNav('moorgate');
        });

        // Waits for the panel to load
        waitsFor(function () {
            panel2 = panel1.nextSibling;
            return panel2;
        });

        // Waits for the panels to stop moving
        waitsFor(function () {
            return !PanelHelper.isMoving(panel0)
                && !PanelHelper.isMoving(panel1)
                && !PanelHelper.isMoving(panel2);
        });

        // Test 3
        // Since there can only be two visible panels maximum
        // We expect the home panel to be hidden on the left of the screen.
        runs(function () {
            expect(spin.getPanelState(panel0)).toBe(spin.PANEL_HIDDENLEFT);
        });

        // We go back to the home panel.
        // Going back to the home panel means that it will take all the space
        // Therefore pushing all others panels to the right.
        runs(function () {
            spin.moveTo(panel0);
        });

        // Waits for all panels to stop moving.
        waitsFor(function () {
            return !PanelHelper.isMoving(panel0)
                && !PanelHelper.isMoving(panel1)
                && !PanelHelper.isMoving(panel2);
        });

        // Test 4
        // Panel 1 & 2 should be both hidden on the right of the screen.
        runs(function () {
            expect(spin.getPanelState(panel1)).toBe(spin.PANEL_HIDDENRIGHT);
            expect(spin.getPanelState(panel2)).toBe(spin.PANEL_HIDDENRIGHT);
        });
    });
});