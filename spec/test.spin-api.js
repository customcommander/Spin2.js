xdescribe('spin.deleteAfter()', function (){
    var panel;

    beforeEach(function (){
        panel = spin();
    });

    it('Throws an error if argument is not a panel', function (){
        var err = new Error('not a panel');

        //obvious cases
        expect(spin.deleteAfter.bind(null)).toThrow(err);
        expect(spin.deleteAfter.bind(null, undefined)).toThrow(err);
        expect(spin.deleteAfter.bind(null, null)).toThrow(err);
        expect(spin.deleteAfter.bind(null, "")).toThrow(err);
        expect(spin.deleteAfter.bind(null, "  ")).toThrow(err);
        expect(spin.deleteAfter.bind(null, "unknown_id")).toThrow(err);
        expect(spin.deleteAfter.bind(null, document.body)).toThrow(err);
    });

    /*
    function should return the panel argument
    */
    it('Deletes all panels after given panel then returns that panel', function (){
        var panels = document.getElementById('spin-panels'),    
            panel,
            fakePanel;

        fakePanel = document.createElement('li');
        fakePanel.classList.add('spin-panel');

        fakePanel.id = 'fake1';
        panels.appendChild(fakePanel);

        fakePanel = fakePanel.cloneNode(true);
        fakePanel.id = 'fake2';
        panels.appendChild(fakePanel);
        
        fakePanel = fakePanel.cloneNode(true);
        fakePanel.id = 'fake3';
        panels.appendChild(fakePanel);

        panel = spin.deleteAfter(panels.firstChild);

        expect(document.getElementById('fake1')).toBe(null);
        expect(document.getElementById('fake2')).toBe(null);
        expect(document.getElementById('fake3')).toBe(null);        
        expect(panels.firstChild.nextSibling).toBe(null);
        expect(panels.lastChild).toBe(panels.firstChild);
        expect(panel).toBe(panels.firstChild);
    });
    
    
});