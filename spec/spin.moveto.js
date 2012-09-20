// Internally spin.moveTo uses spin.getPanel to match a panel corresponding
// to "elt". This is thoroughly tested in spin.getpanel.js already.
describe('spin.moveTo(elt)', function () {

    // Possible visibility states for a panel during of after animation
    var visibility = {
        visible:     10,
        hidden:      11
    };

    // Possible directions for the animation
    var dir = {
        left:        20,
        right:       21
    };

    // Possible states for a panel during or after animation
    var state = {
        full:        31,
        big:         32,
        small:       33,
        hiddenLeft:  34,
        hiddenRight: 35
    };

    beforeEach(function () {

        /*
         * When moving forward or backward css classes are set
         * on #spin-panels during the animation.
         */
        this.addMatchers({

            toMoveLeft: function () {
                var cl = this.actual.classList;
                return cl.contains('spin-moveleft') && !cl.contains('spin-moveright');
            },

            toMoveRight: function () {
                var cl = this.actual.classList;
                return cl.contains('spin-moveright') && !cl.contains('spin-moveleft');
            }
        });

        /*
         * Panel expectations during the animation
         */
        this.addMatchers({

            toGetIn: function () {
                var cl = this.actual.classList;
                return cl.contains('spin-in') && !cl.contains('spin-out');
            },

            toGetOut: function () {
                var cl = this.actual.classList;
                return cl.contains('spin-out') && !cl.contains('spin-in');
            },

            toBecomeSmall: function (curVis, curSt, dir) {
            },

            toBecomeBig: function () {

            },

            toBecomeFull: function (curv, curs, d) {
            },

            toBecomeHiddenLeft: function () {
            },

            toBecomeHiddenRight: function () {

            }
        });

        /*
         * Panel expectation after the animation
         */
        this.addMatchers({
            toBeSmall: function (final) {

                return this.actual.className == 'spin-small';
            },
            toBeBig: function () {
                return this.actual.className == 'spin-big';
            },
            toBeFull: function (prevv, prevs, dir) {
                return this.actual.className == 'spin-full';
            },
            toBeHiddenLeft: function () {
                return this.actual.className == 'spin-hiddenleft';
            },
            toBeHiddenRight: function () {
                return this.actual.className == 'spin-hiddenright';
            }
        });
    }); // beforEach

    xdescribe('Automations', function () {

        var panels,
            home;

        it('Home panel loads', function () {
            runs(function () {
                panels = document.getElementById('spin-panels');
                while (panels.lastChild) {
                    panels.removeChild(panels.lastChild);
                }
                spin.loader()(document.body);
            });

            waitsFor(function () {
                home = panels.firstChild;
                return home;
            }, 'panel is not available', 1000);

            runs(function () {
                expect(home).toBeHiddenRight();
                expect(home).toMoveLeft();
                expect(home).toBecomeFull();
            });

            waitsFor(pause(1000));

            runs(function () {
                expect(home).toBeFull();
            });
        });
    });


});// describe