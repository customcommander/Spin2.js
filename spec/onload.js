describe('On page load', function (){

    // We're testing the availability of the API
    it('Spin is available', function (){
        expect(window.spin).toBeFunction();
        expect(window.spin.xhrLoader).toBeFunction();
        expect(window.spin.loader).toBeFunction();
        expect(window.spin.getPanel).toBeFunction();
        expect(window.spin.moveTo).toBeFunction();
        expect(window.spin.deleteAfter).toBeFunction();
    });

    // On page load, Spin should have dropped its own markup:
    //  <body>
    //      <div id="spin">
    //          <div id="spin-nav"></div>
    //          <div id="spin-panels"></div>
    //      </div>
    //  </body>
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

    it('Home panel has loaded', function (){
        var home;

        // Waits for the panel to arrive
        waitsFor(function (){
            home = document.getElementById('spin-panels').firstChild;
            return home;
        }, 'panel has taken too long to load', 1000);

        runs(function () {
            expect(home).toBecomeFull('spin-hiddenright');
        });

        // Waits for animation to finish
        waitsFor(pause(2000));

        runs(function () {
            expect(home).toBeFull();
        });
    });
});
