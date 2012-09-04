describe('spin.getPanel(elt)', function () {

    it('Returns the corresponding panel', function () {

        var panel = document.getElementById('spin-id1'),
            elt   = document.getElementById('nav1');

        expect(spin.getPanel(0)).toBe(panel);
        expect(spin.getPanel('spin-id1')).toBe(panel);
        expect(spin.getPanel('nav1')).toBe(panel);
        expect(spin.getPanel(panel)).toBe(panel);
        expect(spin.getPanel(elt)).toBe(panel);
    });

    it('Throws an error if panel cannot be found', function () {

        var notFound = new Error('panel not found');

        function getPanel(arg) {
            return spin.getPanel.bind({}, arg);
        }

        expect(getPanel()).toThrow(notFound);
        expect(getPanel(null)).toThrow(notFound);
        expect(getPanel(false)).toThrow(notFound);
        expect(getPanel(true)).toThrow(notFound);
        expect(getPanel(-200)).toThrow(notFound);
        expect(getPanel(200)).toThrow(notFound);
        expect(getPanel(NaN)).toThrow(notFound);
        expect(getPanel(Infinity)).toThrow(notFound);
        expect(getPanel([])).toThrow(notFound);
        expect(getPanel({})).toThrow(notFound);
        expect(getPanel('unknown_id')).toThrow(notFound);
        expect(getPanel('')).toThrow(notFound);
        expect(getPanel('   ')).toThrow(notFound);
        expect(getPanel(document.body)).toThrow(notFound);
        expect(getPanel(document.documentElement)).toThrow(notFound);
        expect(getPanel(function (){})).toThrow(notFound);
    });
});