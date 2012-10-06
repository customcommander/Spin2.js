describe('spin - xhrLoader', function (){

    it ('Is a function', function (){
        expect(spin.xhrLoader).toBeFunction();
    });

    it('Throws an error if argument is not an html element', function (){
        var err = new Error('invalid argument');
        expect(spin.xhrLoader.bind({})).toThrow(err);
        expect(spin.xhrLoader.bind({}, undefined)).toThrow(err);
        expect(spin.xhrLoader.bind({}, null)).toThrow(err);
        expect(spin.xhrLoader.bind({}, '')).toThrow(err);
        expect(spin.xhrLoader.bind({}, false)).toThrow(err);
        expect(spin.xhrLoader.bind({}, NaN)).toThrow(err);
        expect(spin.xhrLoader.bind({}, {})).toThrow(err);
        expect(spin.xhrLoader.bind({}, [])).toThrow(err);
        expect(spin.xhrLoader.bind({}, function (){})).toThrow(err);
        expect(spin.xhrLoader.bind({}, Infinity)).toThrow(err);
        expect(spin.xhrLoader.bind({}, 999)).toThrow(err);
    });

    it('Throws an error if element has no data-url attribute', function (){
        var err = new Error('element has no data-url attribute'),
            el1 = document.createElement('div'),
            el2 = document.createElement('div'),
            el3 = document.createElement('div');

        /*
        Attention:
        
        If assigned programmatically, non string value are casted
        to string beforehand.
        
        Which makes testing against wrong values impossible.

        el.dataset.url = [];            //contains empty string ''
        el.dataset.url = [1,2,3];       //contains string '1,2,3'
        el.dataset.url = false;         //contains string 'false'
        el.dataset.url = 0;             //contains string 'false'
        el.dataset.url = null;          //contains string 'null'
        el.dataset.url = undefined;     //contains string 'undefined'
        el.dataset.url = NaN;           //contains string 'NaN'
        el.dataset.url = Infinity;      //contains string 'Infinity'
        el.dataset.url = {};            //contains string '[object Object]'
        el.dataset.url = function (){}; //contains function code as a string
        */

        el2.dataset.url = '';
        el3.dataset.url = "  \t\r\n  ";

        expect(spin.xhrLoader.bind({}, el1)).toThrow(err);
        expect(spin.xhrLoader.bind({}, el2)).toThrow(err);
        expect(spin.xhrLoader.bind({}, el3)).toThrow(err);
    });
});