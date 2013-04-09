describe('click on non nav element', function () {

    beforeEach(function () {
        runs(AppHelper.restart);
        waitsFor(AppHelper.getHome);
        waitsFor(AppHelper.notMoving);
    });

    it('should not call spin', function () {
        var nonNav = document.getElementById('paneltubemap');
        spyOn(window, 'spin');
        click(nonNav);
        expect(spin).not.toHaveBeenCalled();
    });
});

describe('click on loaded nav element', function () {

    beforeEach(function () {
        runs(AppHelper.restart);
        waitsFor(AppHelper.getHome);
        waitsFor(AppHelper.notMoving);
        runs(function () {
            AppHelper.clickNav('central');
        });
        waitsFor(function () {
            return document.getElementById('panelcentral');
        });
        waitsFor(AppHelper.notMoving);
    });

    it('should not call spin', function () {
        var loadedNav = document.getElementById('central');
        spyOn(window, 'spin');
        click(loadedNav);
        expect(spin).not.toHaveBeenCalled();
    });

    it('should move to the corresponding panel', function () {
        var loadedNav = document.getElementById('central'),
            panel     = spin.getPanel('central'),
            nextPanel = panel.nextSibling;
        spyOn(spin, 'moveTo').andCallThrough();
        click(loadedNav);
        expect(spin.moveTo).toHaveBeenCalledWith(nextPanel);
    });
});

describe('click on nav element', function () {

    beforeEach(function () {
        runs(AppHelper.restart);
        waitsFor(AppHelper.getHome);
        waitsFor(AppHelper.notMoving);
    });

    it('should call spin with the relevant config object', function () {
        var nav = document.getElementById('central');
        spyOn(window, 'spin');
        click(nav);
        expect(spin).toHaveBeenCalledWith({
            url: nav.dataset.url,
            title: nav.dataset.title
        });
    });
});