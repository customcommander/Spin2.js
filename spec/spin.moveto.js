describe("spin.moveTo(elt)", function () {
    beforeEach(function () {
        runs(AppHelper.clear);
        runs(function () {
            spin({ content: '<p id="para1">foobar</p>' });
        });
        waitsFor(AppHelper.notMoving);
    });
    it("should return the corresponding panel", function () {
        var panel = spin.moveTo(document.querySelector(".spin-panel"));
        expect(panel).toBe(document.querySelector(".spin-panel"));
    });
    it("should accept a number", function () {
        var panel = spin.moveTo(0);
        expect(panel).toBe(document.querySelector(".spin-panel"));
    });
    it("should accept an id", function () {
        var panel = spin.moveTo("para1");
        expect(panel).toBe(document.querySelector(".spin-panel"));
    });
    it("should accept an element", function () {
        var panel = spin.moveTo(document.querySelector("#para1"));
        expect(panel).toBe(document.querySelector(".spin-panel"));
    });
    it("should throw if number is out of range", function () {
        expect(function () {
            spin.moveTo(99); }).toThrow();
    });
    it("should throw if id is not found", function () {
        expect(function () {
            spin.moveTo("unknown_id"); }).toThrow();
    });
    it("should throw if element is not within a panel", function () {
        expect(function () {
            spin.moveTo(document.body); }).toThrow();
    });
});

describe("spin.moveTo()", function () {
    beforeEach(function () {
        runs(AppHelper.clear);
    });
    it("should not move if destination is already in full view", function () {
        runs(spin);
        waitsFor(AppHelper.notMoving);
        runs(function () {
            var panel = spin.moveTo(0);
            expect(thisAnim(panel)).toBe("");
        });
    });
    it("should not move if destination is already in big view", function () {
        runs(spin);
        waitsFor(AppHelper.notMoving);
        runs(spin);
        waitsFor(AppHelper.notMoving);
        runs(function () {
            var panel = spin.moveTo(1);
            expect(thisAnim(panel)).toBe("");
        });
    });
});

/******************************************************************************/
/*** Animation Tests Suite ****************************************************/
/******************************************************************************/

// All the css animation classes
var anims = [
    'spin-small-hiddenleft',
    'spin-hiddenleft-small',
    'spin-big-hiddenleft',
    'spin-hiddenleft-big',
    'spin-full-hiddenleft',
    'spin-hiddenleft-full',
    'spin-small-hiddenright',
    'spin-hiddenright-small',
    'spin-big-hiddenright',
    'spin-hiddenright-big',
    'spin-full-hiddenright',
    'spin-hiddenright-full',
    'spin-big-small',
    'spin-small-big',
    'spin-full-small',
    'spin-small-full'
];

// All the css visibility classes
var states = [
    'spin-full',
    'spin-big',
    'spin-small',
    'spin-hiddenright',
    'spin-hiddenleft'
];

// Returns the animation class set on the panel
function thisAnim(pnl) {
    return [].filter.call(pnl.classList, function (cls) {
        return anims.indexOf(cls)>-1; }).join();
}

// Returns the visibility class set on the panel
function thisState(pnl) {
    return [].filter.call(pnl.classList, function (cls) {
        return states.indexOf(cls)>-1; }).join();
}

describe("moving a panel: small ~> hiddenleft", function () {
    beforeEach(function () {
        runs(AppHelper.clear);
        runs(spin); // 0: full
        waitsFor(AppHelper.notMoving);
        runs(spin); // 0: small, 1: big
        waitsFor(AppHelper.notMoving);
        runs(spin); // 0: hiddenleft (to test), 1: small, 2: big
    });
    it("should have the corresponding animation class", function () {
        var panel = spin.getPanel(0);
        expect(thisAnim(panel)).toBe("spin-small-hiddenleft");
    });
    it("should end up hidden on the left", function () {
        waitsFor(AppHelper.notMoving);
        runs(function () {
            var panel = spin.getPanel(0);
            expect(thisState(panel)).toBe("spin-hiddenleft");
        });
    });
});

describe("moving a panel: hiddenleft ~> small", function () {
    beforeEach(function () {
        runs(AppHelper.clear);
        runs(spin);         // 0: full
        waitsFor(AppHelper.notMoving);
        runs(spin);         // 0: small, 1: big
        waitsFor(AppHelper.notMoving);
        runs(spin);         // 0: hiddenleft, 1: small, 2: big
        waitsFor(AppHelper.notMoving);
        runs(function () {  // 0: small (to test), 1: big, 2: hiddenright
            spin.moveTo(1);
        });
    });
    it("should have the corresponding animation class", function () {
        var panel = spin.getPanel(0);
        expect(thisAnim(panel)).toBe("spin-hiddenleft-small");
    });
    it("should end up being small", function () {
        waitsFor(AppHelper.notMoving);
        runs(function () {
            var panel = spin.getPanel(0);
            expect(thisState(panel)).toBe("spin-small");
        });
    });
});

describe("moving a panel: big ~> hiddenleft", function () {
    beforeEach(function () {
        runs(AppHelper.clear);
        runs(spin);         // 0: full
        waitsFor(AppHelper.notMoving);
        runs(spin);         // 0: small, 1: big
        waitsFor(AppHelper.notMoving);
        runs(spin);         // 0: hiddenleft, 1: small, 2: big
        waitsFor(AppHelper.notMoving);
        runs(spin);         // 0: hiddenleft, 1: hiddenleft, 2: small, 3: big
        waitsFor(AppHelper.notMoving);
        runs(function () {
            spin.moveTo(1); // 0: small, 1: big, 2: hiddenright, 3: hiddenright
        });
        waitsFor(AppHelper.notMoving);
        runs(function () {
            spin.moveTo(3); // 0: hiddenleft, 1: hiddenleft (to test), 2: small, 3: big
        });
    });
    it("should have the corresponding animation class", function () {
        var panel = spin.getPanel(1);
        expect(thisAnim(panel)).toBe("spin-big-hiddenleft");
    });
    it("should end up being hidden on the left", function () {
        waitsFor(AppHelper.notMoving);
        runs(function () {
            var panel = spin.getPanel(1);
            expect(thisState(panel)).toBe("spin-hiddenleft");
        });
    });
});

describe("moving a panel: hiddenleft ~> big", function () {
    beforeEach(function () {
        runs(AppHelper.clear);
        runs(spin);         // 0: full
        waitsFor(AppHelper.notMoving);
        runs(spin);         // 0: small, 1: big
        waitsFor(AppHelper.notMoving);
        runs(spin);         // 0: hiddenleft, 1: small, 2: big
        waitsFor(AppHelper.notMoving);
        runs(spin);         // 0: hiddenleft, 1: hiddenleft, 2: small, 3: big
        waitsFor(AppHelper.notMoving);
        runs(function () {  // 0: small, 1: big (to test), 2: hiddenright, 3: hiddenright
            spin.moveTo(1);
        })
    });
    it("should have the corresponding animation class", function () {
        var panel = spin.getPanel(1);
        expect(thisAnim(panel)).toBe("spin-hiddenleft-big");
    });
    it("should end up being big", function () {
        waitsFor(AppHelper.notMoving);
        runs(function () {
            var panel = spin.getPanel(1);
            expect(thisState(panel)).toBe("spin-big");
        });
    });
});

describe("moving a panel: full ~> hiddenleft", function () {
    beforeEach(function () {
        runs(AppHelper.clear);
        runs(spin);         // 0: full
        waitsFor(AppHelper.notMoving);
        runs(spin);         // 0: small, 1: big
        waitsFor(AppHelper.notMoving);
        runs(spin);         // 0: hiddenleft, 1: small, 2: big
        waitsFor(AppHelper.notMoving);
        runs(function () {  // 0: full, 1: hiddenright, 2: hiddenright
            spin.moveTo(0); 
        });
        waitsFor(AppHelper.notMoving);
        runs(function () {  // 0: hiddenleft (to test), 1: small, 2: big
            spin.moveTo(2);
        });
    });
    it("should have the corresponding animation class", function () {
        var panel = spin.getPanel(0);
        expect(thisAnim(panel)).toBe("spin-full-hiddenleft");
    });
    it("should end up being hidden on the left", function () {
        waitsFor(AppHelper.notMoving);
        runs(function () {
            var panel = spin.getPanel(0);
            expect(thisState(panel)).toBe("spin-hiddenleft");
        });
    });
});

describe("moving a panel: hiddenleft ~> full", function () {
    beforeEach(function () {
        runs(AppHelper.clear);
        runs(spin);         // 0: full
        waitsFor(AppHelper.notMoving);
        runs(spin);         // 0: small, 1: big
        waitsFor(AppHelper.notMoving);
        runs(spin);         // 0: hiddenleft, 1: small, 2: big
        waitsFor(AppHelper.notMoving);
        runs(function () {  // 0: full (to test), 1: hiddenright, 2: hiddenright
            spin.moveTo(0);
        });
    });
    it("should have the corresponding animation class", function () {
        var panel = spin.moveTo(0);
        expect(thisAnim(panel)).toBe("spin-hiddenleft-full");
    });
    it("should end up being full", function () {
        waitsFor(AppHelper.notMoving);
        runs(function () {
            var panel = spin.moveTo(0);
            expect(thisState(panel)).toBe("spin-full");
        });
    });
});

describe("moving a panel: small ~> hiddenright", function () {
    beforeEach(function () {
        runs(AppHelper.clear);
        runs(spin);         // 0: full
        waitsFor(AppHelper.notMoving);
        runs(spin);         // 0: small, 1: big
        waitsFor(AppHelper.notMoving);
        runs(spin);         // 0: hiddenleft, 1: small, 2: big
        waitsFor(AppHelper.notMoving);
        runs(function () {  // 0: full, 1: hiddenright (to test), 2: hiddenright
            spin.moveTo(0);
        });
    });
    it("should have the corresponding animation class", function () {
        var panel = spin.getPanel(1);
        expect(thisAnim(panel)).toBe("spin-small-hiddenright");
    });
    it("should end up being hidden on the right", function () {
        waitsFor(AppHelper.notMoving);
        runs(function () {
            var panel = spin.getPanel(1);
            expect(thisState(panel)).toBe("spin-hiddenright")
        });
    });
});

describe("moving a panel: hiddenright ~> small", function () {
    beforeEach(function () {
        runs(AppHelper.clear);
        runs(spin);         // 0: full
        waitsFor(AppHelper.notMoving);
        runs(spin);         // 0: small, 1: big
        waitsFor(AppHelper.notMoving);
        runs(spin);         // 0: hiddenleft, 1: small, 2: big
        waitsFor(AppHelper.notMoving);
        runs(function () {  // 0: full, 1: hiddenright, 2: hiddenright
            spin.moveTo(0);
        });
        waitsFor(AppHelper.notMoving);
        runs(function () {  // 0: hiddenleft, 1: small (to test), 2: big
            spin.moveTo(2);
        });
    });
    it("should have the corresponding animation class", function () {
        var panel = spin.getPanel(1);
        expect(thisAnim(panel)).toBe("spin-hiddenright-small");
    });
    it("should end up being small", function () {
        waitsFor(AppHelper.notMoving);
        runs(function () {
            var panel = spin.getPanel(1);
            expect(thisState(panel)).toBe("spin-small");
        });
    });
});

describe("moving a panel: big ~> hiddenright", function () {
    beforeEach(function () {
        runs(AppHelper.clear);
        runs(spin);         // 0: full
        waitsFor(AppHelper.notMoving);
        runs(spin);         // 0: small, 1: big
        waitsFor(AppHelper.notMoving);
        runs(function () {  // 0: full, 1: hiddenright (to test)
            spin.moveTo(0);
        });
    });
    it("should have the corresponding animation class", function () {
        var panel = spin.getPanel(1);
        expect(thisAnim(panel)).toBe("spin-big-hiddenright");
    });
    it("should end up being hidden on the right", function () {
        waitsFor(AppHelper.notMoving)
        runs(function () {
            var panel = spin.getPanel(1);
            expect(thisState(panel)).toBe("spin-hiddenright");
        });
    });
});

describe("moving a panel: hiddenright ~> big", function () {
    beforeEach(function () {
        runs(AppHelper.clear);
        runs(spin); // 0: full
        waitsFor(AppHelper.notMoving);
        runs(spin); // 0: small, 1: big (to test, was: hiddenright)
    });
    it("should have the corresponding animation class", function () {
        var panel = spin.getPanel(1);
        expect(thisAnim(panel)).toBe("spin-hiddenright-big");
    });
    it("should end up being big", function () {
        waitsFor(AppHelper.notMoving);
        runs(function () {
            var panel = spin.getPanel(1);
            expect(thisState(panel)).toBe("spin-big")
        });
    });
});

describe("moving a panel: hiddenright ~> full", function () {
    beforeEach(function () {
        runs(AppHelper.clear);
        runs(spin); // 0: full (to test, was: hiddenright)
    });
    it("should have the corresponding animation class", function () {
        var panel = spin.getPanel(0);
        expect(thisAnim(panel)).toBe("spin-hiddenright-full");
    });
    it("should end up being full", function () {
        waitsFor(AppHelper.notMoving);
        runs(function () {
            var panel = spin.getPanel(0);
            expect(thisState(panel)).toBe("spin-full");
        });
    });
});

describe("moving a panel: small ~> big", function () {
    beforeEach(function () {
        runs(AppHelper.clear);
        runs(spin);         // 0: full
        waitsFor(AppHelper.notMoving);
        runs(spin);         // 0: small, 1: big
        waitsFor(AppHelper.notMoving);
        runs(spin);         // 0: hiddenleft, 1: small, 2: big
        waitsFor(AppHelper.notMoving);
        runs(function () {  // 0: small, 1: big (to test), 2: hiddenright
            spin.moveTo(1);
        });
    });
    it("should have the corresponding animation class", function () {
        var panel = spin.getPanel(1);
        expect(thisAnim(panel)).toBe("spin-small-big");
    });
    it("should end up being big", function () {
        waitsFor(AppHelper.notMoving);
        runs(function () {
            var panel = spin.getPanel(1);
            expect(thisState(panel)).toBe("spin-big");
        });
    });
});

describe("moving a panel: full ~> small", function () {
    beforeEach(function () {
        runs(AppHelper.clear);
        runs(spin); // 0: full
        waitsFor(AppHelper.notMoving);
        runs(spin); // 0: small (to test), 1: big
    });
    it("should have the corresponding animation class", function () {
        var panel = spin.getPanel(0);
        expect(thisAnim(panel)).toBe("spin-full-small");
    });
    it("should end up being small", function () {
        waitsFor(AppHelper.notMoving);
        runs(function () {
            var panel = spin.getPanel(0);
            expect(thisState(panel)).toBe("spin-small");
        });
    });
});

describe("moving a panel: small ~> full", function () {
    beforeEach(function () {
        runs(AppHelper.clear);
        runs(spin);         // 0: full
        waitsFor(AppHelper.notMoving);
        runs(spin);         // 0: small, 1: big
        waitsFor(AppHelper.notMoving);
        runs(function () {  // 0: full (to test), 1: hiddenright
            spin.moveTo(0);
        });
    });
    it("should have the corresponding animation class", function () {
        var panel = spin.getPanel(0);
        expect(thisAnim(panel)).toBe("spin-small-full");
    });
    it("should end up being full", function () {
        waitsFor(AppHelper.notMoving);
        runs(function () {
            var panel = spin.getPanel(0);
            expect(thisState(panel)).toBe("spin-full");
        });
    });
});