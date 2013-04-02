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
});