describe('spin.moveTo(elt)', function () {

    describe('Use Case', function () {

        var panels = {};

        // Case 1
        it('Home panel loads', function () {
            runs(AppHelper.restart);

            waitsFor(function () {
                panels.home = AppHelper.getHome();
                return panels.home;
            });

            runs(function () {
                expect(panels.home).toBecomeFull('spin-hiddenright');
            });

            waitsFor(AppHelper.notMoving);

            runs(function () {
                expect(panels.home).toBeFull();
            });
        });

        // Case 2
        it('Click on "Hammersmith & City Line"', function () {

            runs(function () {
                AppHelper.clickNav('hammersmithandcity');
            });

            waitsFor(function () {
                panels.hammersmithAndCity = panels.home.nextSibling;
                return panels.hammersmithAndCity;
            });

            runs(function () {
                expect(panels.home).toBecomeSmall('spin-full');
                expect(panels.hammersmithAndCity).toBecomeBig('spin-hiddenright');
            });

            waitsFor(AppHelper.notMoving);

            runs(function () {
                expect(panels.home).toBeSmall();
                expect(panels.hammersmithAndCity).toBeBig();
            });
        });

        // Case 3
        it('Click on "Moorgate"', function () {

            runs(function () {
                AppHelper.clickNav('moorgate');
            });

            waitsFor(function () {
                panels.moorgate = panels.hammersmithAndCity.nextSibling;
                return panels.moorgate;
            });

            runs(function () {
                expect(panels.home).toBecomeHiddenLeft('spin-small');
                expect(panels.hammersmithAndCity).toBecomeSmall('spin-big');
                expect(panels.moorgate).toBecomeBig('spin-hiddenright');
            });

            waitsFor(AppHelper.notMoving);

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

            waitsFor(AppHelper.notMoving);

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

            waitsFor(AppHelper.notMoving);

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

            waitsFor(AppHelper.notMoving);

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
                AppHelper.clickNav('circle');
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

            waitsFor(AppHelper.notMoving);

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

            waitsFor(AppHelper.notMoving);

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

            waitsFor(AppHelper.notMoving);

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

            waitsFor(AppHelper.notMoving);

            runs(function () {
                expect(panels.home).toBeFull();
                expect(panels.hammersmithAndCity).toBeHiddenRight();
                expect(panels.moorgate).toBeHiddenRight();
                expect(panels.circle).toBeHiddenRight();
            });
        });

        // Case 10
        it('Go to "Circle Line"', function () {

            runs(function () {
                spin.moveTo(panels.circle);
                expect(panels.home).toBecomeHiddenLeft('spin-full');
                expect(panels.hammersmithAndCity).toBeHiddenLeft();
                expect(panels.moorgate).toBecomeSmall('spin-hiddenright');
                expect(panels.circle).toBecomeBig('spin-hiddenright');
            });

            waitsFor(AppHelper.notMoving);

            runs(function () {
                expect(panels.home).toBeHiddenLeft();
                expect(panels.hammersmithAndCity).toBeHiddenLeft();
                expect(panels.moorgate).toBeSmall();
                expect(panels.circle).toBeBig();
            });
        });

        it('Click to "Monument"', function () {

            runs(function () {
                AppHelper.clickNav('monument');
            });

            waitsFor(function () {
                panels.monument = panels.circle.nextSibling;
                return panels.monument;
            });

            runs(function () {
                expect(panels.home).toBeHiddenLeft();
                expect(panels.hammersmithAndCity).toBeHiddenLeft();
                expect(panels.moorgate).toBecomeHiddenLeft('spin-small');
                expect(panels.circle).toBecomeSmall('spin-big');
                expect(panels.monument).toBecomeBig('spin-hiddenright');
            });

            waitsFor(AppHelper.notMoving);

            runs(function () {
                expect(panels.home).toBeHiddenLeft();
                expect(panels.hammersmithAndCity).toBeHiddenLeft();
                expect(panels.moorgate).toBeHiddenLeft();
                expect(panels.circle).toBeSmall();
                expect(panels.monument).toBeBig();
            });
        });

        it('Go back to "Moorgate"', function () {

            runs(function () {
                spin.moveTo(panels.moorgate);
                expect(panels.home).toBeHiddenLeft();
                expect(panels.hammersmithAndCity).toBecomeSmall('spin-hiddenleft');
                expect(panels.moorgate).toBecomeBig('spin-hiddenleft');
                expect(panels.circle).toBecomeHiddenRight('spin-small');
                expect(panels.monument).toBecomeHiddenRight('spin-big');
            });

            waitsFor(AppHelper.notMoving);

            runs(function () {
                expect(panels.home).toBeHiddenLeft();
                expect(panels.hammersmithAndCity).toBeSmall();
                expect(panels.moorgate).toBeBig();
                expect(panels.circle).toBeHiddenRight();
                expect(panels.monument).toBeHiddenRight();
            });
        });

        // Case 11
        it('Go back to Home', function () {

            runs(function () {
                spin.moveTo(panels.home);
                expect(panels.home).toBecomeFull('spin-hiddenleft');
                expect(panels.hammersmithAndCity).toBecomeHiddenRight('spin-small');
                expect(panels.moorgate).toBecomeHiddenRight('spin-big');
                expect(panels.circle).toBeHiddenRight();
                expect(panels.monument).toBeHiddenRight();
            });

            waitsFor(AppHelper.notMoving);

            runs(function () {
                expect(panels.home).toBeFull();
                expect(panels.hammersmithAndCity).toBeHiddenRight();
                expect(panels.moorgate).toBeHiddenRight();
                expect(panels.circle).toBeHiddenRight();
                expect(panels.monument).toBeHiddenRight();
            });
        });

        it('Go to "Circle Line"', function () {

            runs(function () {
                spin.moveTo(panels.circle);
                expect(panels.home).toBecomeHiddenLeft('spin-full');
                expect(panels.hammersmithAndCity).toBeHiddenLeft();
                expect(panels.moorgate).toBecomeSmall('spin-hiddenright');
                expect(panels.circle).toBecomeBig('spin-hiddenright');
                expect(panels.monument).toBeHiddenRight();
            });

            waitsFor(AppHelper.notMoving);

            runs(function () {
                expect(panels.home).toBeHiddenLeft();
                expect(panels.hammersmithAndCity).toBeHiddenLeft();
                expect(panels.moorgate).toBeSmall();
                expect(panels.circle).toBeBig();
                expect(panels.monument).toBeHiddenRight();
            });
        });

        // We should not move if we try to go to a panel that is big or full
        it('Does not move if we go to a panel that is big or full', function () {

            // The "Circle Line" panel should already be 'big' at this point.
            runs(function () {
                spin.moveTo(panels.circle);
                expect(panels.home).toBeHiddenLeft();
                expect(panels.hammersmithAndCity).toBeHiddenLeft();
                expect(panels.moorgate).toBeSmall();
                expect(panels.circle).toBeBig();
                expect(panels.monument).toBeHiddenRight();
            });

            // Home panel should currently be hidden on the left and moving there will expand it to 'full'.
            // We're not testing panels states again as this is already toroughly done above.
            runs(function () {
                spin.moveTo(panels.home);
            });

            // Waiting for the animation to finish.
            waitsFor(AppHelper.notMoving);

            // At this point Home panel should be 'full' and moving to there should have no effect.
            runs(function () {
                spin.moveTo(panels.home);
                expect(panels.home).toBeFull();
                expect(panels.hammersmithAndCity).toBeHiddenRight();
                expect(panels.moorgate).toBeHiddenRight();
                expect(panels.circle).toBeHiddenRight();
                expect(panels.monument).toBeHiddenRight();
            });
        });
    }); // describe: Use Case


    it('Returns the corresponding panel', function () {
        expect(spin.moveTo(0)).toBe(spin.getPanel(0));
    });

    it('Throws an error if corresponding panel cannot be found', function () {
        var notFoundErr = new Error('panel not found');

        function notFound(elt) {
            return spin.moveTo.bind({}, elt);
        }

        // Valid calls but we are not expecting to find a panel
        expect(notFound('unknown_id')).toThrow(notFoundErr);
        expect(notFound(document.body)).toThrow(notFoundErr);
        expect(notFound(-999)).toThrow(notFoundErr);
        expect(notFound(999)).toThrow(notFoundErr);
    });

    it('Throws an error if a bad call is made', function () {

        var badCallErr  = new Error('bad function call');

        function badCall(elt) {
            return spin.moveTo.bind({}, elt);
        }

        expect(badCall()).toThrow(badCallErr);
        expect(badCall('')).toThrow(badCallErr);
        expect(badCall('   ')).toThrow(badCallErr);
        expect(badCall(Infinity)).toThrow(badCallErr);
        expect(badCall(-Infinity)).toThrow(badCallErr);
        expect(badCall(NaN)).toThrow(badCallErr);
        expect(badCall(null)).toThrow(badCallErr);
        expect(badCall(undefined)).toThrow(badCallErr);
        expect(badCall(true)).toThrow(badCallErr);
        expect(badCall(false)).toThrow(badCallErr);
        expect(badCall([])).toThrow(badCallErr);
        expect(badCall({})).toThrow(badCallErr);
        expect(badCall(function () {})).toThrow(badCallErr);
    });
});// describe