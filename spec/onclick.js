
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

// Makes sure that if we click on an element that is not defined as
// a navigable element but is contained inside one that is,
// we still handle the click correctly.
describe("click inside a nav element", function () {

    beforeEach(function () {
        runs(AppHelper.clear);
    });

    it("should call spin", function () {
        var panel;
        runs(function () {
            panel = spin({
                title: 'click inside a nav element',
                content:
                    '<ol>' +
                    '   <li class="nav" ' +
                    '       data-title="Tube Map" ' +
                    '       data-url="panel.tubemap.html">' +
                    '       <ol>' +
                    '           <li id="should_be_clickable">click</li>' +
                    '       </ol>' +
                    '   </li>' +
                    '</ol>'
            });
        });

        waitsFor(AppHelper.notMoving);

        runs(function () {
            spinSpy();
            click(document.querySelector('#should_be_clickable'));
            expect(spin).toHaveBeenCalledWith({
                title: 'Tube Map',
                url: 'panel.tubemap.html'
            });
        });

        waitsFor(AppHelper.notMoving);
    });
});