// Internally spin.moveTo uses spin.getPanel to match a panel corresponding
// to "elt". This is thoroughly tested in spin.getpanel.js already.
describe('spin.moveTo(elt)', function () {

    /*
     * Makes sure a panel has the given classes and only these ones.
     * @param {HTMLElement} panel
     * @param {Array} cls List of classes (e.g. ['spin-small', 'spin-small-big'])
     */
    function strictClassCheck(panel, cls) {
        // A panel must always have that class anyway.
        cls.push('spin-panel');
        return cls.length == panel.classList.length
            && cls.every(function (cur) {
                return panel.classList.contains(cur); });
    }

    beforeEach(function () {

        this.addMatchers({
            toBecomeSmall: function (curState) {
                return strictClassCheck(this.actual, [curState, curState + '-small']);
            },
            toBecomeBig: function (curState) {
                return strictClassCheck(this.actual, [curState, curState + '-big']);
            },
            toBecomeFull: function (curState) {
                return strictClassCheck(this.actual, [curState, curState + '-full']);
            },
            toBecomeHiddenLeft: function (curState) {
                return strictClassCheck(this.actual, [curState, curState + '-hiddenleft']);
            },
            toBecomeHiddenRight: function (curState) {
                return strictClassCheck(this.actual, [curState, curState + '-hiddenright']);
            },
            toBeSmall: function () {
                return strictClassCheck(this.actual, ['spin-small']);
            },
            toBeBig: function () {
                return strictClassCheck(this.actual, ['spin-big']);
            },
            toBeFull: function () {
                return strictClassCheck(this.actual, ['spin-full']);
            },
            toBeHiddenLeft: function () {
                return strictClassCheck(this.actual, ['spin-hiddenleft']);
            },
            toBeHiddenRight: function () {
                return strictClassCheck(this.actual, ['spin-hiddenright']);
            }
        });
    }); // beforeEach

    describe('Use Case', function () {

        var panels = {};

        beforeEach(function () {
            waitsFor(pause(1000));
        });

        // Case 1
        it('Home panel loads', function () {
            // Fakes a fresh start (as if the page just loaded)
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
                expect(panels.home).toBecomeFull('spin-hiddenright');
            });

            waitsFor(pause(2000));

            runs(function () {
                expect(panels.home).toBeFull();
            });
        });

        // Case 2
        it('Click on "Hammersmith & City Line"', function () {

            runs(function () {
                clickNav('hammersmithandcity');
            });

            waitsFor(function () {
                panels.hammersmithAndCity = panels.home.nextSibling;
                return panels.hammersmithAndCity;
            }, 'panel is not available', 1000);

            runs(function () {
                expect(panels.home).toBecomeSmall('spin-full');
                expect(panels.hammersmithAndCity).toBecomeBig('spin-hiddenright');
            });

            waitsFor(pause(2000));

            runs(function () {
                expect(panels.home).toBeSmall();
                expect(panels.hammersmithAndCity).toBeBig();
            });
        });

        // Case 3
        it('Click on "Moorgate"', function () {

            runs(function () {
                clickNav('moorgate');
            });

            waitsFor(function () {
                panels.moorgate = panels.hammersmithAndCity.nextSibling;
                return panels.moorgate;
            }, 'panel is not available', 1000);

            runs(function () {
                expect(panels.home).toBecomeHiddenLeft('spin-small');
                expect(panels.hammersmithAndCity).toBecomeSmall('spin-big');
                expect(panels.moorgate).toBecomeBig('spin-hiddenright');
            });

            waitsFor(pause(2000));

            runs(function () {
                expect(panels.home).toBeHiddenLeft();
                expect(panels.hammersmithAndCity).toBeSmall();
                expect(panels.moorgate).toBeBig();
            });
        });

        // Case 4
        it('Go back to "Hammersmith & City Line"', function () {

            runs(function () {
                spin.moveTo(panels.hammersmithAndCity);
                expect(panels.home).toBecomeSmall('spin-hiddenleft');
                expect(panels.hammersmithAndCity).toBecomeBig('spin-small');
                expect(panels.moorgate).toBecomeHiddenRight('spin-big');
            });

            waitsFor(pause(2000));

            runs(function () {
                expect(panels.home).toBeSmall();
                expect(panels.hammersmithAndCity).toBeBig();
                expect(panels.moorgate).toBeHiddenRight();
            });
        });

        // Case 5
        it('Go back to Home', function () {

            runs(function () {
                spin.moveTo(panels.home);
                expect(panels.home).toBecomeFull('spin-small');
                expect(panels.hammersmithAndCity).toBecomeHiddenRight('spin-big');
                expect(panels.moorgate).toBeHiddenRight();
            });

            waitsFor(pause(2000));

            runs(function () {
                expect(panels.home).toBeFull();
                expect(panels.hammersmithAndCity).toBeHiddenRight();
                expect(panels.moorgate).toBeHiddenRight();
            });
        });

        // Case 6
        it('Go back to "Moorgate"', function () {

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

        // Case 7
        // We need to load a new panel beforehand
        it('Click on "Circle Line"', function () {

            runs(function () {
                clickNav('circle');
            });

            waitsFor(function () {
                panels.circle = panels.moorgate.nextSibling;
                return panels.circle;
            }, 'panel is not available', 1000);

            runs(function () {
                expect(panels.home).toBeHiddenLeft();
                expect(panels.hammersmithAndCity).toBecomeHiddenLeft('spin-small');
                expect(panels.moorgate).toBecomeSmall('spin-big');
                expect(panels.circle).toBecomeBig('spin-hiddenright');
            });

            waitsFor(pause(2000));

            runs(function () {
                expect(panels.home).toBeHiddenLeft();
                expect(panels.hammersmithAndCity).toBeHiddenLeft();
                expect(panels.moorgate).toBeSmall();
                expect(panels.circle).toBeBig();
            });
        });

        it('Go back to "Hammersmith & City Line"', function () {

            runs(function () {
                spin.moveTo(panels.hammersmithAndCity);
                expect(panels.home).toBecomeSmall('spin-hiddenleft');
                expect(panels.hammersmithAndCity).toBecomeBig('spin-hiddenleft');
                expect(panels.moorgate).toBecomeHiddenRight('spin-small');
                expect(panels.circle).toBecomeHiddenRight('spin-big');
            });

            waitsFor(pause(2000));

            runs(function () {
                expect(panels.home).toBeSmall();
                expect(panels.hammersmithAndCity).toBeBig();
                expect(panels.moorgate).toBeHiddenRight();
                expect(panels.circle).toBeHiddenRight();
            });
        });

        // Case 8
        it('Go to "Circle Line"', function () {
            runs(function () {
                spin.moveTo(panels.circle);
                expect(panels.home).toBecomeHiddenLeft('spin-small');
                expect(panels.hammersmithAndCity).toBecomeHiddenLeft('spin-big');
                expect(panels.moorgate).toBecomeSmall('spin-hiddenright');
                expect(panels.circle).toBecomeBig('spin-hiddenright');
            });

            waitsFor(pause(2000));

            runs(function () {
                expect(panels.home).toBeHiddenLeft();
                expect(panels.hammersmithAndCity).toBeHiddenLeft();
                expect(panels.moorgate).toBeSmall();
                expect(panels.circle).toBeBig();
            });
        });

        // Case 9
        it('Go back to Home', function () {
            runs(function () {
                spin.moveTo(panels.home);
                expect(panels.home).toBecomeFull('spin-hiddenleft');
                expect(panels.hammersmithAndCity).toBeHiddenRight();
                expect(panels.moorgate).toBecomeHiddenRight('spin-small');
                expect(panels.circle).toBecomeHiddenRight('spin-big');
            });

            waitsFor(pause(2000));

            runs(function () {
                expect(panels.home).toBeFull();
                expect(panels.hammersmithAndCity).toBeHiddenRight();
                expect(panels.moorgate).toBeHiddenRight();
                expect(panels.circle).toBeHiddenRight();
            });
        });
    }); // describe: Use Case
});// describe