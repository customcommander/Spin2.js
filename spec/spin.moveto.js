// Internally spin.moveTo uses spin.getPanel to match a panel corresponding
// to "elt". This is thoroughly tested in spin.getpanel.js already.
describe('spin.moveTo(elt)', function () {

    var panels; // Reference to #spin-panels

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

        panels = panels || document.getElementById('spin-panels');

        /*
         * When moving forward or backward css classes are set
         * on #spin-panels during the animation.
         */
        this.addMatchers({

            toMoveLeft: function () {
                return this.actual.className == 'spin-moveleft';
            },

            toMoveRight: function () {
                return this.actual.className == 'spin-moveright';
            },

            toHaveMoved: function () {
                // When animation has finished these classes shouldn't be there anymore
                return this.actual.className == '';
            }
        });

        /*
         * Panel expectations during the animation
         */
        this.addMatchers({

            toBecomeSmall: function () {

            },

            toBecomeBig: function () {

            },

            toBecomeFull: function () {

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

            toBeSmall: function () {

            },
            toBeBig: function () {

            },
            toBeFull: function () {

            },
            toBeHiddenLeft: function () {

            },
            toBeHiddenRight: function () {

            }
        });
    }); // beforEach
});// describe