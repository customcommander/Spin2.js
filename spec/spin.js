// Expected behaviour for spin()
describe('spin()', function () {

    afterEach(function () {
        spin.deleteAfter(0);
    });

    describe('If called with no argument', function () {

        it('Panel title is empty', function () {
            var panel = spin(),
                title = panel.getElementsByClassName('spin-panel-hd')[0].textContent.trim();
            expect(title).toBe('');
        });

        it('Panel content is empty', function () {
            var panel = spin(),
                content = panel.getElementsByClassName('spin-panel-bd')[0].innerHTML;
            expect(content).toBe('');
        });
    });

    describe('If called with an object', function () {

        describe('"title" property', function (){

            it('Can be a string', function (){
                var panel = spin({ title: 'Hello' }),
                    title = panel.getElementsByClassName('spin-panel-hd')[0].textContent.trim();
                expect(title).toBe('Hello');
            });

            it('Defaults to an empty string', function (){
                var panel = spin(),
                    title = panel.getElementsByClassName('spin-panel-hd')[0].textContent.trim();
                expect(title).toBe('');
            });
        });

        describe('"content" property', function () {

            it('Can be a string', function () {
                var panel, content;
                panel = spin({ content: '<p>Hello</p>' });
                content = panel.getElementsByClassName('spin-panel-bd')[0].innerHTML;
                expect(content).toBe('<p>Hello</p>');
            });

            it('Can be a html element', function () {
                var panel, content, el;
                el = document.createElement('p');
                el.innerHTML = '<b>Hello</b>';
                panel = spin({ content: el });
                content = panel.getElementsByClassName('spin-panel-bd')[0].innerHTML;
                expect(content).toBe('<p><b>Hello</b></p>');
            });

            it('Defaults to an empty string', function () {
                var panel, content;
                panel = spin();
                content = panel.getElementsByClassName('spin-panel-bd')[0].innerHTML;
                expect(content).toBe('');
            });
        });
    });
});