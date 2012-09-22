// Internally spin.moveTo uses spin.getPanel to match a panel corresponding
// to "elt". This is thoroughly tested in spin.getpanel.js already.
describe('spin.moveTo(elt)', function () {

    var states = [
         'spin-hiddenleft'
        ,'spin-hiddenright'
        ,'spin-small'
        ,'spin-big'
        ,'spin-full'
    ];

    var animations = [
         'spin-hiddenright-small'
        ,'spin-hiddenright-big'
        ,'spin-hiddenright-full'
        ,'spin-hiddenleft-small'
        ,'spin-hiddenleft-big'
        ,'spin-hiddenleft-full'
        ,'spin-big-small'
        ,'spin-big-hiddenright'
        ,'spin-small-hiddenleft'
        ,'spin-small-big'
        ,'spin-small-full'
        ,'spin-full-hiddenleft'
    ];

    function classCheck(panel, cls, all) {
        var cl = panel.classList,
            exclude = all.filter(function (cur) { return cur != cls; });
        return cl.contains(cls)
            && !exclude.some(function (cur) {
                return cl.contains(cur); });
    }

    beforeEach(function () {

        /*
         * Panel expectations during the animation
         */
        this.addMatchers({
            toBecomeSmall: function (curState) {
                return classCheck(this.actual, curState + '-small', animations);
            },
            toBecomeBig: function (curState) {
                return classCheck(this.actual, curState + '-big', animations);
            },
            toBecomeFull: function (curState) {
                return classCheck(this.actual, curState + '-full', animations);
            },
            toBecomeHiddenLeft: function (curState) {
                return classCheck(this.actual, curState + '-hiddenleft', animations);
            },
            toBecomeHiddenRight: function (curState) {
                return classCheck(this.actual, curState + '-hiddenright', animations);
            }
        });

        /*
         * Panel expectation after the animation
         */
        this.addMatchers({
            toBeSmall: function () {
                return classCheck(this.actual, 'spin-small', states);
            },
            toBeBig: function () {
                return classCheck(this.actual, 'spin-big', states);
            },
            toBeFull: function () {
                return classCheck(this.actual, 'spin-full', states);
            },
            toBeHiddenLeft: function () {
                return classCheck(this.actual, 'spin-hiddenleft', states);
            },
            toBeHiddenRight: function () {
                return classCheck(this.actual, 'spin-hiddenright', states);
            }
        });
    }); // beforEach

    describe('Use Case', function () {

        var panels = {};

        it('Home panel loads', function () {
            runs(function () {
                var el = document.getElementById('spin-panels');
                while (el.lastChild) {
                    el.removeChild(el.lastChild);
                }
                spin.loader()(document.body);
            });

            waitsFor(function () {
                panels.home = document.getElementById('spin-panels').firstChild;
                return panels.home;
            }, 'panel is not available', 1000);

            runs(function () {
                expect(panels.home).toBeHiddenRight();
                expect(panels.home).toBecomeFull('spin-hiddenright');
            });

            waitsFor(pause(1000));

            runs(function () {
                expect(panels.home).toBeFull();
            });
        });

        it('Go to "Hammersmith & City Line"', function () {
            waitsFor(pause(1000));

            runs(function () {
                clickNav('hammersmithandcity');
            });

            waitsFor(function () {
                panels.hammersmithAndCity = panels.home.nextSibling;
                return panels.hammersmithAndCity;
            }, 'panel is not available', 1000);

            runs(function () {
                expect(panels.home).toBeFull();
                expect(panels.home).toBecomeSmall('spin-full');
                expect(panels.hammersmithAndCity).toBeHiddenRight();
                expect(panels.hammersmithAndCity).toBecomeBig('spin-hiddenright');
            });

            waitsFor(pause(2000));

            runs(function () {
                expect(panels.home).toBeSmall();
                expect(panels.hammersmithAndCity).toBeBig();
            });
        });

        it('Go to "Moorgate"', function () {
            waitsFor(pause(1000));

            runs(function () {
                clickNav('moorgate');
            });

            waitsFor(function () {
                panels.moorgate = panels.hammersmithAndCity.nextSibling;
                return panels.moorgate;
            });

            runs(function () {
                expect(panels.home).toBecomeHiddenLeft('spin-small');
                expect(panels.hammersmithAndCity).toBecomeSmall('spin-big');
                expect(panels.moorgate).toBeHiddenRight();
                expect(panels.moorgate).toBecomeBig('spin-hiddenright');
            });

            waitsFor(pause(2000));

            runs(function () {
                expect(panels.home).toBeHiddenLeft();
                expect(panels.hammersmithAndCity).toBeSmall();
                expect(panels.moorgate).toBeBig();
            });
        });

        it('Go back to "Hammersmith & City Line"', function () {
            waitsFor(pause(1000));

            runs(function () {
                spin.moveTo(panels.hammersmithAndCity);
                expect(panels.hammersmithAndCity).toBecomeBig('spin-small');
                expect(panels.home).toBecomeSmall('spin-hiddenleft');
                expect(panels.moorgate).toBecomeHiddenRight('spin-big');
            });

            waitsFor(pause(2000));

            runs(function () {
                expect(panels.home).toBeSmall();
                expect(panels.hammersmithAndCity).toBeBig();
                expect(panels.moorgate).toBeHiddenRight();
            });
        });

        it('Go back to home', function () {

            waitsFor(pause(1000));

            runs(function () {
                spin.moveTo(panels.home);
                expect(panels.home).toBecomeFull('spin-small');
                expect(panels.hammersmithAndCity).toBecomeHiddenRight('spin-big');
            });

            waitsFor(pause(2000));

            runs(function () {
                expect(panels.home).toBeFull();
                expect(panels.hammersmithAndCity).toBeHiddenRight();
            });
        });

        it('Go straight to "Moorgate"', function () {

            waitsFor(pause(1000));

            runs(function () {
                spin.moveTo(panels.moorgate);
                expect(panels.home).toBecomeHiddenLeft('spin-full');
                expect(panels.hammersmithAndCity).toBecomeSmall('spin-hiddenright');
                expect(panels.moorgate).toBecomeBig('spin-hiddenright');
            });

            waitsFor(pause(2000));

            runs(function () {
                expect(panels.home).toBeHiddenLeft();
                expect(panels.hammersmithAndCity).toBeSmall();
                expect(panels.moorgate).toBeBig();
            });
        });
    });


});// describe