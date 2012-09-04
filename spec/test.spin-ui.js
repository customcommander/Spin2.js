/*
 *
 *
 */
describe('User Interface', function (){

    describe('Setup', function (){
        it('Listens to every single click', function (){
            var clickHandler = jasmine.createSpy('clickHandler'),
                panels       = document.getElementById('spin-panels'),
                panel        = panels.firstChild,
                panelHead    = panel.getElementsByClassName('spin-panel-hd')[0],
                panelBody    = panel.getElementsByClassName('spin-panel-bd')[0];

            panels.addEventListener('click', clickHandler, false);

            triggerEvent('click', panels);
            triggerEvent('click', panel);
            triggerEvent('click', panelHead);
            triggerEvent('click', panelBody);

            expect(clickHandler.callCount).toBe(4);
            
            panels.removeEventListener('click', clickHandler, false);
        });
    });

    describe('Click on nav item', function (){

        var fakeLoader,
            navItem;

        beforeEach(function (){
            fakeLoader = jasmine.createSpy('fakeLoader');
            navItem = document.getElementsByClassName('nav')[0];
            spin(fakeLoader);
        });

        it('Calls the loader if nav item is not loaded', function (){
            navItem.classList.remove('loaded');            
            triggerEvent('click', navItem);
            expect(fakeLoader).toHaveBeenCalled();
        });

        it('Sets nav item to be loaded', function (){
            navItem.classList.remove('loaded');
            triggerEvent('click', navItem);
            expect(navItem.classList.contains('loaded')).toBe(true);
        });

        it('Does nothing if nav item is loaded already', function (){
            navItem.classList.add('loaded');
            triggerEvent('click', navItem);
            expect(fakeLoader).not.toHaveBeenCalled();
        });        
    });

    describe('Click on a non nav item', function (){
        it('Does nothing', function (){
            var noopLoader = jasmine.createSpy('noopLoader');
            spin(noopLoader);
            triggerEvent('click', document.getElementById('spin-panels'));
            expect(noopLoader).not.toHaveBeenCalled();
        });
    });

    describe('Loading a panel', function (){
        
    });
});