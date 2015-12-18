var test = require("tape");
var Parser = require("../");

test("=== String Replaces ===", function(_test) {
	_test.test("replaces matches with string", function(t) {
		t.plan(1);
		var p = new Parser();
		p.addRule("findme", "replaced");
		t.equal(
			p.render("this should findme here and findme over here."),
			"this should replaced here and replaced over here.",
			"replaced correctly"
		);
	});
});

test("=== Function Replaces ===", function(_test) {
	_test.test("replaces with returned contents", function(t) {
		t.plan(1);
		var p = new Parser();
		p.addRule("findme", function() {
			return "replaced";
		});
		t.equal(
			p.render("this should findme here and findme over here."),
			"this should replaced here and replaced over here.",
			"replaced correctly"
		);
	});

	_test.test("replaces tree with object when returned", function(t) {
		t.plan(2);
		var p = new Parser();
		p.addRule("findme", function() {
			return { type: "find", value: "me", text: "replaced" };
		});
		t.deepEqual(p.toTree("this should findme here."), [
			{ type: "text", text: "this should " },
			{ type: "find", value: "me", text: "replaced" },
			{ type: "text", text: " here." }
		], "tree output matches");
		t.equal(
			p.render("this should findme here."),
			"this should replaced here.",
			"replaced correctly"
		);
	});

	_test.test("calls replace function with matched string", function(t) {
		t.plan(1);
		var p = new Parser();
		p.addRule("findme", function(arg) {
			t.equal(arg, "findme", "passed matched string through");
		});
		p.render("this should findme here.");
	});

	_test.test("calls replace function with regexp groups", function(t) {
		t.plan(2);
		var p = new Parser();
		p.addRule(/(find)(me)/, function(arg, m1, m2) {
			t.equal(m1, "find", "first group match was correct");
			t.equal(m2, "me", "second group match was correct");
		});
		p.render("this should findme here.");
	});
});
