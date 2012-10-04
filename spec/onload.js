describe('On page load', function (){

    // We're testing the availability of the API
    it('Spin is available', function (){
        expect(window.spin).toBeFunction();
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
        }, 'panel has taken to long to load', 1000);

        // Waits for animation to finish
        waitsFor(pause(2000));

        runs(function () {
            var posLeft, totalWidth;

            // Home panel should have the following css classes only
            expect(home.classList.length).toBe(2);
            expect(home.classList.contains('spin-panel'));
            expect(home.classList.contains('spin-full'));

            // Dimensions expectations
            posLeft    = parseInt(getComputedStyle(home).left, 10);
            totalWidth = parseInt(getComputedStyle(home).width, 10)+1;

            expect(posLeft).toBe(0);
            expect(totalWidth).toBe(window.innerWidth);
        });
    });
});
