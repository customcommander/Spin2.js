
describe("click on a non loaded nav element (last panel)", function () {

    beforeEach(function () {
        runs(AppHelper.restart);
        waitsFor(AppHelper.notMoving);
        runs(function () {
            spinSpy();
            click(document.querySelector("#central"));
        });
    });

    afterEach(function () {
        waitsFor(AppHelper.notMoving);
    });

    it("should set nav as loaded", function () {
        var nav = document.querySelector("#central");
        expect(nav.classList.contains("loaded")).toBe(true);
    });

    it("should call spin with the correct configuration object", function () {
        expect(spin).toHaveBeenCalledWith({ title: "Central Line",
                                            url:   "panel.central.html" });
    });
});

describe("click on a non loaded nav element (not last panel)", function () {

    beforeEach(function () {
        runs(AppHelper.restart);
        waitsFor(AppHelper.notMoving);
        runs(function () {
            click(document.querySelector("#central"));
        });
        waitsFor(AppHelper.notMoving);
        runs(function () {
            spinSpy();
            click(document.querySelector("#hammersmithandcity"));
        });
    });

    afterEach(function () {
        waitsFor(AppHelper.notMoving);
    });

    it("should reset previously loaded nav", function () {
        var nav = document.querySelector("#central");
        expect(nav.classList.contains("loaded")).toBe(false);
    });

    it("should set current nav as loaded", function () {
        var nav = document.querySelector("#hammersmithandcity");
        expect(nav.classList.contains("loaded")).toBe(true);
    });

    // We need to make sure that we've called spin with 
    // a reference to the panel that needs to be replaced.
    it("should call spin with the correct configuration object", function () {
        var home    = spin.getPanel("hammersmithandcity"),
            central = home.nextSibling;
        expect(spin).toHaveBeenCalledWith({ title: "Hammersmisth & City Line",
                                            url:   "panel.hammersmithandcity.html",
                                            panel: central.id });
    });
});

describe("click on a non loaded nav element (all)", function () {

    beforeEach(function () {
        runs(AppHelper.restart);
        waitsFor(AppHelper.notMoving);
    });

    it("should not call spin if there is no url", function () {
        spinSpy();
        click(document.querySelector("#piccadilly"));
        expect(spin).not.toHaveBeenCalled();
    });
});

describe("click on a loaded nav element", function () {

    beforeEach(function () {
        runs(AppHelper.restart);
        waitsFor(AppHelper.notMoving);
        runs(function () {
            click(document.querySelector('#central'));
        });
        waitsFor(AppHelper.notMoving);
    });

    afterEach(function () {
        waitsFor(AppHelper.notMoving);
    });

    it("should not call spin", function () {
        spinSpy();
        click(document.querySelector("#central"));
        expect(spin).not.toHaveBeenCalled();
    });

    it("should move to the next panel", function () {
        var panel = spin.getPanel("central");
        spyOn(spin, 'moveTo');
        click(document.querySelector("#central"));
        expect(spin.moveTo).toHaveBeenCalledWith(panel.nextSibling);
    });
});

describe("click on a non nav element", function () {
    
    beforeEach(function () {
        runs(AppHelper.restart);
        waitsFor(AppHelper.notMoving);
    });

    it("should not call spin", function () {
        spinSpy();
        // #paneltubemap is a non nav element
        // see panel.tubemap.html
        click(document.querySelector("#paneltubemap"));
        expect(spin).not.toHaveBeenCalled();
    });
});
