
describe("spin api", function () {

    it("should expose spin()", function () {
        expect(spin).toBeFunction();
    });

    it("should expose spin.getPanel()", function () {
        expect(spin.getPanel).toBeFunction();
    });

    it("should expose spin.moveTo()", function () {
        expect(spin.moveTo).toBeFunction();
    });
});

describe("spin html markup", function () {

    describe("main element", function () {

        it("should be defined", function () {
            expect(document.querySelector("#spin")).toBeDefined();
        });

        it("should have two children", function () {
            expect(document.querySelector("#spin").childNodes.length).toBe(2);
        });
    });

    describe("navigation element", function () {

        it("should be defined", function () {
            expect(document.querySelector("#spin-nav")).toBeDefined();
        });

        it("should be inside the main element", function () {
            expect(document.querySelector("#spin-nav").parentNode).toBe(document.querySelector("#spin"));
        });
    });

    describe("panels element", function () {

        it("should be defined", function () {
            expect(document.querySelector("#spin-panels")).toBeDefined();
        });

        it("should be inside the main element", function () {
            expect(document.querySelector("#spin-panels").parentNode).toBe(document.querySelector("#spin"));
        });
    });
});

describe("home panel", function () {
    it("should have loaded", function () {
        expect(document.querySelector("#spin-panels").firstChild).toBeDefined();
    });
});