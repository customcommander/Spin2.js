describe("spin() - in general", function () {

    var panel;

    beforeEach(function () {
        runs( AppHelper.clear );
        runs(function () {
            panel = spin({ title: 'spin_common' });
        });
        waitsFor( AppHelper.notMoving );
    });

    it("should create the panel", function () {
        expect(document.querySelector('.spin-panel')).toBeDefined();
    });

    it("should return the panel", function () {
        expect(document.querySelector('.spin-panel')).toBe(panel);
    });

    it("should make the panel visible", function () {
        // a panel can be hidden either on the left or on the right
        // the correponding css classes are "spin-hiddenleft" and "spin-hiddenright"
        expect(panel.className).not.toMatch('spin-hidden');
    });

    it("should throw if cfg is given but not an object", function () {
        expect( spin.bind(null, 999) ).toThrow();
    });
});

describe("spin() - config object", function () {

    beforeEach(function () {
        runs( AppHelper.clear );
    });

    afterEach(function () {
        waitsFor( AppHelper.notMoving );
    });

    describe("cfg.title", function () {

        it("should set the title of the panel", function () {
            var panel = spin({ title: "Hello" });
            expect(PanelHelper.getTitle(panel)).toBe("Hello");
        });

        it("should default to an empty string if not given", function () {
            var panel = spin();
            expect(PanelHelper.getTitle(panel)).toBe("");
        });

        it("should throw an error if given but not a string", function () {
            expect( spin.bind(null, { title: 999 }) ).toThrow();
        });
    });

    describe("cfg.content", function () {

        it("should set the content of the panel", function () {
            var panel = spin({ content: "<p>Hello</p>" });
            expect(PanelHelper.getContent(panel)).toBe("<p>Hello</p>");
        });

        it("should default to an empty string if not given", function () {
            var panel = spin();
            expect(PanelHelper.getContent(panel)).toBe("");
        });

        it("should throw an error if given but not a string", function () {
            expect( spin.bind(null, { content: 999 }) ).toThrow();
        });
    });

    describe("cfg.url", function () {

        it("should throw an error if given but not a string", function () {
            expect( spin.bind(null, { url: 999 }) ).toThrow();
        });

        it("should throw an error if given but empty", function () {
            expect( spin.bind(null, { url: "" }) ).toThrow();
        });

        it("should throw an error if given but only contains whitespace(s)", function () {
            expect( spin.bind(null, { url: "  \t\r\n  " }) ).toThrow();
        });
    });

    describe("cfg.panel", function () {

        it("should throw an error if given but not valid", function () {
            expect( spin.bind(null, { panel: false }) ).toThrow();
        });

        it("should throw an error if given but doesn't exist", function () {
            expect( spin.bind(null, { panel: 999 }) ).toThrow();
        });
    });
});

// When code is part of the content (cfg.content) it has to be executed
// when the panel is created an appended to the DOM.
describe("spin() - with javascript", function () {

    beforeEach(function () {
        runs( AppHelper.clear );
        runs( function () {
            window.exec_count = 0;
            spin({
                title: 'exec_code_test',
                content:
                    '<script src="/shouldload.js"></script>' +
                    '<div id="div1">' +
                        '<script id="js1" type="text/javascript">window.exec_count++;</script>' +
                        '<div id="div2">' +
                            '<script id="js2" type="text/javascript">window.exec_count++;</script>' +
                            '<div id="div3">' +
                                '<script id="js3" type="text/javascript">window.exec_count++;</script>' +
                            '</div>' +
                        '</div>' +
                    '</div>'
            });
        });
        waitsFor( AppHelper.notMoving );
    });

    it("should execute all code", function () {
        expect(window.exec_count).toBe(3);
    });

    it("should preserve original script nodes order", function () {
        var div3 = document.querySelector("#div3"),
            js3  = document.querySelector("#js3");
        expect(js3.parentNode).toBe(div3);
    });

    it("should preserve original script nodes attributes", function () {
        var js3 = document.querySelector("#js3");
        expect(js3.type).toBe("text/javascript");
    });

    it("should load script", function () {
        // See shouldload.js
        expect(window.has_loaded).toBe(true);
    });
});

// What should happen when
//
//      spin({
//          panel: <string>,<number>,<element>
//          title: <string>
//          content: <string>
//      });
// ???
describe("spin() - with a panel", function () {

    beforeEach(function () {
        runs( AppHelper.clear );
        runs( spin.bind(null, { title: "spin_panel_0" }) );
        waitsFor( AppHelper.notMoving );
        runs( spin.bind(null, { title: "spin_panel_1" }) );
        waitsFor( AppHelper.notMoving );
    });

    afterEach(function () {
        waitsFor( AppHelper.notMoving );
    });

    it("should delete everything after it", function () {
        var panel = spin({ panel: 0 });
        expect(panel.nextSibling).toBeNull();
    });

    it("should update its title", function () {
        var panel = spin({ panel: 0, title: "updated" });
        expect(PanelHelper.getTitle(panel)).toBe("updated");
    });

    it("should update its content", function () {
        var panel = spin({ panel: 0, content: "<p>updated</p>" });
        expect(PanelHelper.getContent(panel)).toBe("<p>updated</p>");
    });

    it("should update its content with a response from url", function () {
        var panel;
        runs(function () {
            panel = spin({ panel: 0, url: "panel.central.html" });
        });
        waitsFor(function () {
            return !panel.classList.contains("loading");
        }, 3000, "panel has taken too long to load");
        runs(function () {
            expect(document.querySelector("#panelcentral")).not.toBeNull();
        });
    });
});

describe('the loading process', function () {

    beforeEach(function () {
        runs(AppHelper.restart);
        waitsFor(AppHelper.getHome);
        waitsFor(AppHelper.notMoving);
    });

    it('should cancel any pending request', function () {
        spin({ url: 'panel.central.html' });
        spin({ url: 'panel.tubemap.html' });
        expect(document.getElementById('panelcentral')).toBeNull();
    });

    it('should append a loading panel', function () {
        var panel = spin({ url: 'panel.tubemap.html' });
        expect(panel.classList.contains('loading')).toBe(true);
    });

    it('should replace the loading panel with the returned content', function () {
        var panel;
        runs(function () {
            panel = spin({ url: 'panel.central.html' });
        });
        waitsFor(function () {
            return !panel.classList.contains('loading');
        }, 5000, 'panel to load');
        runs(function () {
            expect(panel.querySelector('#panelcentral')).not.toBeNull();
        });
    });
});

describe('the loading panel', function () {

    it('should be the last panel', function () {
        var panels = document.getElementById('spin-panels');
        var panel  = spin({ url: 'panel.tubemap.html' });
        expect(panels.lastChild).toBe(panel);
    });

    it('should be unique', function () {
        spin({ url: 'panel.tubemap.html' });
        spin({ url: 'panel.tubemap.html' });
        expect(document.querySelectorAll('.spin-panel.loading').length).toBe(1);
    });

    it('should have a title if given', function () {
        var panel = spin({ url: 'panel.tubemap.html', title: 'loading' });
        expect(PanelHelper.getTitle(panel)).toBe('loading');
    });

    it('should have content if given', function () {
        var panel = spin({ url: 'panel.tubemap.html', content: '<p>loading...</p>' });
        expect(PanelHelper.getContent(panel)).toBe('<p>loading...</p>');
    });
});