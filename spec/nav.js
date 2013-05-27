// The navigation bar contains all the bread crumbs.
// There should be one bread crumb per panel.
describe("navigation bar", function () {

    beforeEach(function () {
        runs(AppHelper.clear);
        runs( spin.bind(null, {title:'nav_1'}) );
        waitsFor(AppHelper.notMoving);
        runs( spin.bind(null, {title:'nav_2'}) );
        waitsFor(AppHelper.notMoving);
        runs( spin.bind(null, {title:'nav_3'}) );
        waitsFor(AppHelper.notMoving);
    });

    it("should have one bread crumb per panel", function () {
        var panels = document.getElementById('spin-nav');
        expect(panels.childNodes.length).toBe(3);
    });
});

// Some fairly simple expectations for a bread crumb
describe("bread crumb", function () {

    beforeEach(function () {
        runs( AppHelper.clear );
        runs( spin.bind(null, {title:'breadcrumb_1'}) );
        waitsFor( AppHelper.notMoving );
    });

    it("should have an id", function () {
        var breadCrumb = document.getElementById('spin-nav').firstChild;
        expect(breadCrumb.id).toBeDefined();
    });

    it("should have a css class", function () {
        var breadCrumb = document.getElementById('spin-nav').firstChild;
        expect(breadCrumb.className).toBeDefined();
    });

    it("should match a panel", function () {

        var breadCrumb = document.getElementById('spin-nav').firstChild,
            id;

        // extracts the panel id from the bread crumb id
        // "spin-id99-crumb" ~> "spin-id99"
        id = breadCrumb.id;
        id = id.substr(0, id.lastIndexOf('-'));

        expect(document.getElementById(id)).toBeDefined();
    });
});

// The navigation bar should always reflect the current state of the view.
describe("navigation bar update", function () {

    // Given the following HTML:
    //
    //  <ol id="spin-nav">
    //      <li class="foo">...</li>
    //      <li class="bar">...</li>
    //      <li class="baz">...</li>
    //  </ol>
    // 
    // Returns all css class names in a csv string:
    //  => "foo,bar,baz"
    function classNames() {
        var nav = document.getElementById('spin-nav');
        function getClass(el) { return el.className; }
        return [].map.call(nav.childNodes, getClass).join();
    }

    beforeEach(function () {
        runs( AppHelper.clear );
        runs( spin.bind(null, {title:'nav_update_1'}) );
        waitsFor( AppHelper.notMoving );
    });

    it("should occur when adding panels", function () {

        var prev, cur;

        // There is just one panel. Captures all the css classes.
        runs(function () {
            prev = classNames();
        });

        runs(function () {
            spin({title:'nav_update_2'});
        });

        waitsFor(AppHelper.notMoving);

        // There are two panels now so the css classes should be different.
        runs(function () {
            cur = classNames();
            expect(prev).not.toBe(cur);
        });
    });

    it("should occur after panels have finished to move", function () {

        var prev, cur;

        runs(function () {
            spin({title:'nav_update_3'});
        });

        waitsFor(AppHelper.notMoving);

        // There are two visible panels. Capturing class names.
        runs(function () {
            prev = classNames();
        });

        // Moving back to the first panel.
        // This makes the first panel to be the only one in view.
        runs(function () {
            spin.moveTo(0);
        });

        waitsFor(AppHelper.notMoving);

        // Only one panel (the first one) is visible now.
        runs(function () {
            cur = classNames();
            expect(prev).not.toBe(cur);
        });
    });
});

// When a user clicks on a bread crumb the view must be updated
// so that the requested panel is displayed to the user.
describe("click on a bread crumb", function () {

    beforeEach(function () {
        runs( AppHelper.clear );
        runs( spin.bind(null, {title:'click_nav_1'}) );
        waitsFor( AppHelper.notMoving );
        runs( spin.bind(null, {title:'click_nav_2'}) );
        waitsFor( AppHelper.notMoving );
    });

    it("should move to the corresponding panel", function () {

        var breadcrumb,
            panel;

        runs(function () {
            breadcrumb = document.getElementById('spin-nav').firstChild;
            panel      = document.getElementById('spin-panels').firstChild;
        });

        // this should move to the first panel, i.e. make it "full screen"
        runs(function () {
            click(breadcrumb);
        });

        waitsFor( AppHelper.notMoving );

        // So at the end when the panels have finished moving
        // the first panel should be fully expanded.
        runs(function () {
            expect(panel).toBeFull();
        });
    });
});

describe("css class of the last panel's bread crumb", function () {

    beforeEach(function () {

        runs(AppHelper.clear);

        runs(function () {
            spin({title: 'panel_1'});
        });

        waitsFor(AppHelper.notMoving);
    });

    it("should be 'crumb4' if panel is visible", function () {
        // panel_1's bread crumb
        var breadcrumb = document.getElementById('spin-nav').firstChild;
        expect(breadcrumb.className).toBe('crumb4');
    });

    it("should be 'crumb1' if panel is not visible", function () {

        runs(function () {
            spin({title:'panel_2'});
        });

        waitsFor(AppHelper.notMoving);

        // going back to home so that panel_1 is hidden
        runs(function () {
            spin.moveTo(0);
        });

        waitsFor(AppHelper.notMoving);

        runs(function () {
            // panel_2's bread crumb
            var breadcrumb = document.getElementById('spin-nav').lastChild;
            expect(breadcrumb.className).toBe('crumb1');
        });
    });
});

describe("css class of a visible panel's bread crumb", function () {

    beforeEach(function () {

        runs(AppHelper.clear);

        runs(function () {
            spin({title: 'panel_1'});
        });

        waitsFor(AppHelper.notMoving);

        runs(function () {
            spin({title: 'panel_2'});
        });

        waitsFor(AppHelper.notMoving);
    });

    it("should be 'crumb5' if next panel is visible", function () {
        // panel_1's bread crumb
        var breadcrumb = document.getElementById('spin-nav').firstChild;
        expect(breadcrumb.className).toBe('crumb5');
    });

    it("should be 'crumb6' if next panel is not visible", function () {

        // Moving back to home in order to hide panel_2
        runs(function () {
            spin.moveTo(0);
        });

        waitsFor(AppHelper.notMoving);

        runs(function () {
            // panel_1's bread crumb
            var breadcrumb = document.getElementById('spin-nav').firstChild;
            expect(breadcrumb.className).toBe('crumb6');
        });
    });
});

describe("css class of a non visible panel's bread crumb", function () {

    beforeEach(function () {

        runs(AppHelper.clear);

        runs(function () {
            spin({title: 'panel_1'});
        });

        waitsFor(AppHelper.notMoving)

        runs(function () {
            spin({title: 'panel_2'});
        })

        waitsFor(AppHelper.notMoving);

        runs(function () {
            spin({title: 'panel_3'});
        });

        waitsFor(AppHelper.notMoving);
    });

    it("should be 'crumb3' if next panel is visible", function () {
        // panel_1's bread crumb; panel_1 is hidden, panel_2 is not
        var breadcrumb = document.getElementById('spin-nav').firstChild;
        expect(breadcrumb.className).toBe('crumb3');
    });

    it("should be 'crumb2' if next panel is not visible", function () {

        runs(function () {
            spin({title: 'panel_4'});
        });

        waitsFor(AppHelper.notMoving);

        runs(function () {
            // panel_1's bread crumb; panel_1 and panel_2 are now both hidden
            var breadcrumb = document.getElementById('spin-nav').firstChild;
            expect(breadcrumb.className).toBe('crumb2');
        });
    });
});