// Expected behaviour for spin()
describe('spin([cfg])', function () {

    var panel;

    afterEach(function () {
        waitsFor(AppHelper.notMoving);
    });

    describe('cfg.content', function () {

        it('Sets panel content', function () {
            panel = spin({ content: '<p>Hello</p>' });
            expect(PanelHelper.getContent(panel)).toBe('<p>Hello</p>');
        });

        it('Defaults to an empty string', function () {
            panel = spin();
            expect(PanelHelper.getContent(panel)).toBe('');
        });

        it('should throw an error if it\'s not a string', function () {
            function call() {
                spin({ content: 999 });
            }
            expect(call).toThrow();
        });
    });

    describe('cfg.title', function () {

        it('Sets panel title', function () {
            panel = spin({ title: 'Hello' });
            expect(PanelHelper.getTitle(panel)).toBe('Hello');
        });

        it('Defaults to an empty string', function () {
            panel = spin();
            expect(PanelHelper.getTitle(panel)).toBe('');
        });

        it('should throw an error if it\'s not a string', function () {
            function call() {
                spin({ title: 999 });
            }
            expect(call).toThrow();
        });
    });

    it('Returns the panel that has been created', function () {
        panel = spin();
        expect(panel).toBeDefined();
    });

    it('Appends the panel into the DOM', function () {
        panel = spin();
        expect(panel.parentNode).toBe(document.getElementById('spin-panels'));
    });

    it('Executes javascript', function () {
        var panel;
        window.foobar = jasmine.createSpy('foobar');
        panel = spin({ content: '<script>window.foobar();</script>' });
        expect(window.foobar).toHaveBeenCalled();
    });

    it('should throw an error if it\'s not an object', function () {
        function call() {
            spin(999);
        }
        expect(call).toThrow();
    });

    describe("spin({ url: 'panel.html' })", function () {

        it('should throw an error if url is not a string', function () {
            function call() {
                spin({ url: 999 });
            }
            expect(call).toThrow();
        });

        it('should throw an error if url is empty', function () {
            function call() {
                spin({ url: "" });
            }
            expect(call).toThrow();
        });

        it('should throw an error if url only contains whitespaces', function () {
            function call() {
                spin({ url: "  \t\r\n  " });
            }
            expect(call).toThrow();
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
        var panel;
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