describe("spin.getPanel(elt)", function () {

    beforeEach(function () {
        runs( AppHelper.restart );
        waitsFor( AppHelper.notMoving );
    });

    it("should accept an element id within a panel", function () {
        var panel = spin.getPanel('central');
        expect(panel).toBe(document.querySelector('.spin-panel'));
    });

    it("should accept an element within a panel", function () {
        var panel = spin.getPanel(document.querySelector("#central"));
        expect(panel).toBe(document.querySelector('.spin-panel'));
    });

    it("should accept a panel id", function () {
        var panel = spin.getPanel(document.querySelector('.spin-panel').id);
        expect(panel).toBe(document.querySelector('.spin-panel'));
    });

    it("should accept a panel", function () {
        var panel = spin.getPanel(document.querySelector('.spin-panel'));
        expect(panel).toBe(document.querySelector('.spin-panel'));
    });

    it("should accept a number", function () {
        var panel = spin.getPanel(0);
        expect(panel).toBe(document.querySelector('.spin-panel'));
    });

    it("should throw if elt is not valid", function () {
        expect(function () { spin.getPanel([]); }).toThrow();
    });

    it("should throw if number is out of range", function () {
        expect(function () { spin.getPanel(99); }).toThrow();
    });

    it("should throw if id is not within a panel", function () {
        expect(function () { spin.getPanel('spin-nav'); }).toThrow();
    });

    it("should throw if element is not within a panel", function () {
        expect(function () { spin.getPanel(document.body); }).toThrow();
    });

    it("should throw if id doesn't exist", function () {
        expect(function () { spin.getPanel('unknown_id'); }).toThrow();
    });
});