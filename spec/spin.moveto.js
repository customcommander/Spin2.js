// Internally spin.moveTo uses spin.getPanel to match a panel corresponding
// to "elt". This is thoroughly tested in spin.getpanel.js already.
describe('spin.moveTo(elt)', function () {

    function strictClassCheck(panel, cls) {
        // A panel must in all circonstances have that class
        cls.push('spin-panel');
        return cls.length == panel.classList.length
            && cls.every(function (cur) {
                return panel.classList.contains(cur); });
    }

    beforeEach(function () {

        waitsFor(pause(1000));

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

        describe('We need some panels first', function () {

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

            it('Go to "Hammersmith & City Line"', function () {

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

            it('Go to "Moorgate"', function () {

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

            it('Go to "Circle Line"', function () {

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

            it('Go to "Monument"', function () {

                runs(function () {
                    clickNav('monument');
                });

                waitsFor(function () {
                    panels.monument = panels.circle.nextSibling;
                    return panels.monument;
                }, 'panel is not available', 1000);

                runs(function () {
                    expect(panels.home).toBeHiddenLeft();
                    expect(panels.hammersmithAndCity).toBeHiddenLeft();
                    expect(panels.moorgate).toBecomeHiddenLeft('spin-small');
                    expect(panels.circle).toBecomeSmall('spin-big');
                    expect(panels.monument).toBecomeBig('spin-hiddenright');
                });

                waitsFor(pause(2000));

                runs(function () {
                    expect(panels.home).toBeHiddenLeft();
                    expect(panels.hammersmithAndCity).toBeHiddenLeft();
                    expect(panels.moorgate).toBeHiddenLeft();
                    expect(panels.circle).toBeSmall();
                    expect(panels.monument).toBeBig();
                });
            });

            it('Go to "Central Line"', function () {

                runs(function () {
                    clickNav('central');
                });

                waitsFor(function () {
                    panels.central = panels.monument.nextSibling;
                    return panels.central;
                }, 'panel is not available', 1000);

                runs(function () {
                    expect(panels.home).toBeHiddenLeft();
                    expect(panels.hammersmithAndCity).toBeHiddenLeft();
                    expect(panels.moorgate).toBeHiddenLeft();
                    expect(panels.circle).toBecomeHiddenLeft('spin-small');
                    expect(panels.monument).toBecomeSmall('spin-big');
                    expect(panels.central).toBecomeBig('spin-hiddenright');
                });

                waitsFor(pause(2000));

                runs(function () {
                    expect(panels.home).toBeHiddenLeft();
                    expect(panels.hammersmithAndCity).toBeHiddenLeft();
                    expect(panels.moorgate).toBeHiddenLeft();
                    expect(panels.circle).toBeHiddenLeft();
                    expect(panels.monument).toBeSmall();
                    expect(panels.central).toBeBig();
                });
            });

            it('Go to "Holborn"', function () {

                runs(function () {
                    clickNav('holborn');
                });

                waitsFor(function () {
                    panels.holborn = panels.central.nextSibling;
                    return panels.holborn;
                }, 'panel is not available', 1000);

                runs(function () {
                    expect(panels.home).toBeHiddenLeft();
                    expect(panels.hammersmithAndCity).toBeHiddenLeft();
                    expect(panels.moorgate).toBeHiddenLeft();
                    expect(panels.circle).toBeHiddenLeft();
                    expect(panels.monument).toBecomeHiddenLeft('spin-small');
                    expect(panels.central).toBecomeSmall('spin-big');
                    expect(panels.holborn).toBecomeBig('spin-hiddenright');
                });

                waitsFor(pause(2000));

                runs(function () {
                    expect(panels.home).toBeHiddenLeft();
                    expect(panels.hammersmithAndCity).toBeHiddenLeft();
                    expect(panels.moorgate).toBeHiddenLeft();
                    expect(panels.circle).toBeHiddenLeft();
                    expect(panels.monument).toBeHiddenLeft();
                    expect(panels.central).toBeSmall();
                    expect(panels.holborn).toBeBig();
                });
            });
        });

        describe('Move to "Holborn"', function () {
            it('Has no effect because it already has focus', function () {
                spin.moveTo(panels.holborn);
                expect(panels.home).toBeHiddenLeft();
                expect(panels.moorgate).toBeHiddenLeft();
                expect(panels.circle).toBeHiddenLeft();
                expect(panels.monument).toBeHiddenLeft();
                expect(panels.central).toBeSmall();
                expect(panels.holborn).toBeBig();
            });
        });




        xit('Go back to "Hammersmith & City Line"', function () {
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

        xit('Go back to home', function () {

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

        xit('Go straight to "Moorgate"', function () {

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


        xit('Go straight to home', function () {

            waitsFor(pause(1000));

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

        xit('Go straight to "Circle Line"', function () {

            waitsFor(pause(1000));

            runs(function () {
                spin.moveTo(panels.circle);
                expect(panels.home).toBecomeHiddenLeft('spin-full');
                expect(panels.hammersmithAndCity).toBeHiddenLeft();
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


        

        xit('Go straight to "Moorgate"', function () {

            waitsFor(pause(1000));

            runs(function () {
                spin.moveTo(panels.moorgate);
                expect(panels.home).toBeHiddenLeft();
                expect(panels.hammersmithAndCity).toBecomeSmall('spin-hiddenleft');
                expect(panels.moorgate).toBecomeBig('spin-hiddenleft');
                expect(panels.circle).toBecomeHiddenLeft('spin-small');
                expect(panels.monument).toBecomeSmall('spin-big');
                expect(panels.holborn).toBecomeBig('spin-hiddenright');
            });

            waitsFor(pause(2000));

            runs(function () {
                expect(panels.home).toBeHiddenLeft();
                expect(panels.hammersmithAndCity).toBeHiddenLeft();
                expect(panels.moorgate).toBeHiddenLeft();
                expect(panels.circle).toBeHiddenLeft();
                expect(panels.monument).toBeSmall();
                expect(panels.holborn).toBeBig();
            });
        });

    }); // Use Case
});// describe