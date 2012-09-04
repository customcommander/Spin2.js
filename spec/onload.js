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
    it('Spin base markup has been dropped', function () {
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

    describe('When application starts', function (){
    
        it('Home panel loads', function (){
            waitsFor(function (){
                return document.getElementById('spin-panels').firstChild;
            }, 'Panel has taken to long to load', 10000);
            runs(function (){
                expect(document.getElementById('spin-panels').firstChild).toBePanel();
            });
        });
        
        it('Home panel takes all width available', function (){
            var panel = document.getElementById('spin-panels').firstChild;
            expect(parseInt(getComputedStyle(panel).left, 10)).toBe(0);
            expect(parseInt(panel.style.width, 10)).toBe(window.innerWidth);
        });
    });
});
