// Expected behaviour for spin()
describe('spin([cfg])', function () {

    describe('cfg.content', function () {

        it('Sets panel content', function () {
            runs(function () {
                var panel   = spin({ content: '<p>Hello</p>' }),
                    content = PanelHelper.getContent(panel);
                expect(content).toBe('<p>Hello</p>');
            });
            // Waits for animation to finish
            waitsFor(pause(2000));
        });

        it('Defaults to an empty string', function () {
            runs(function () {
                var panel   = spin(),
                    content = PanelHelper.getContent(panel);
                expect(content).toBe('');
            });
            // Waits for animation to finish
            waitsFor(pause(2000));
        });

        it('Throws an error if content is not a string', function () {
            var badCallErr = new Error('bad function call');

            function badCall(cfg) {
                return spin.bind({}, cfg);
            }

            expect(badCall({ content: undefined })).toThrow(badCallErr);
            expect(badCall({ content: null })).toThrow(badCallErr);
            expect(badCall({ content: true })).toThrow(badCallErr);
            expect(badCall({ content: false })).toThrow(badCallErr);
            expect(badCall({ content: 1 })).toThrow(badCallErr);
            expect(badCall({ content: 0 })).toThrow(badCallErr);
            expect(badCall({ content: -1 })).toThrow(badCallErr);
            expect(badCall({ content: NaN })).toThrow(badCallErr);
            expect(badCall({ content: Infinity })).toThrow(badCallErr);
            expect(badCall({ content: -Infinity })).toThrow(badCallErr);
            expect(badCall({ content: [] })).toThrow(badCallErr);
            expect(badCall({ content: {} })).toThrow(badCallErr);
            expect(badCall({ content: document.body })).toThrow(badCallErr);
            expect(badCall({ content: function () {} })).toThrow(badCallErr);
            expect(badCall({ content: new function () {} })).toThrow(badCallErr);
        });
    });

    describe('cfg.title', function () {
        it('Sets panel title', function () {
            runs(function () {
                var panel = spin({ title: 'Hello' }),
                    title = PanelHelper.getTitle(panel);
                expect(title).toBe('Hello');
            });
            waitsFor(pause(2500));
        });

        it('Defaults to an empty string', function () {
            runs(function () {
                var panel = spin();
                    title = PanelHelper.getTitle(panel);
                expect(title).toBe('');
            });
            waitsFor(pause(2000));
        });

        it('Throws an error if title is not a string', function () {
            var badCallErr = new Error('bad function call');

            function badCall(content, title) {
                return spin.bind({}, content, title);
            }

            expect(badCall({ title: undefined })).toThrow(badCallErr);
            expect(badCall({ title: null })).toThrow(badCallErr);
            expect(badCall({ title: true })).toThrow(badCallErr);
            expect(badCall({ title: false })).toThrow(badCallErr);
            expect(badCall({ title: 1 })).toThrow(badCallErr);
            expect(badCall({ title: 0 })).toThrow(badCallErr);
            expect(badCall({ title: -1 })).toThrow(badCallErr);
            expect(badCall({ title: NaN })).toThrow(badCallErr);
            expect(badCall({ title: Infinity })).toThrow(badCallErr);
            expect(badCall({ title: -Infinity })).toThrow(badCallErr);
            expect(badCall({ title: [] })).toThrow(badCallErr);
            expect(badCall({ title: {} })).toThrow(badCallErr);
            expect(badCall({ title: document.body })).toThrow(badCallErr);
            expect(badCall({ title: function () {} })).toThrow(badCallErr);
            expect(badCall({ title: new function () {} })).toThrow(badCallErr);
        });
    });

    it('Returns the panel that has been created', function () {
        var panel;
        runs(function () {
            panel = spin();
        });
        waitsFor(pause(1500), 'Timeout!', 2000);
        runs(function () {
            expect(panel).toBeDefined();
            expect(panel.parentNode).toBe(document.getElementById('spin-panels'));
        });
        runs(function () {
            spin.deleteAfter(0);
        });
        waitsFor(pause(1500), 'Timeout!', 2000);
    });

    it('Throws an error if cfg is not an object', function () {
        var badCallErr = new Error('bad function call');

        function badCall(cfg) {
            return spin.bind({}, cfg);
        }

        expect(badCall(null)).toThrow(badCallErr);
        expect(badCall(undefined)).toThrow(badCallErr);
        expect(badCall(true)).toThrow(badCallErr);
        expect(badCall(false)).toThrow(badCallErr);
        expect(badCall(1)).toThrow(badCallErr);
        expect(badCall(0)).toThrow(badCallErr);
        expect(badCall(Infinity)).toThrow(badCallErr);
        expect(badCall(-Infinity)).toThrow(badCallErr);
        expect(badCall(NaN)).toThrow(badCallErr);
        expect(badCall([])).toThrow(badCallErr);
        expect(badCall(document.body)).toThrow(badCallErr);
        expect(badCall(function () {})).toThrow(badCallErr);
    });
});