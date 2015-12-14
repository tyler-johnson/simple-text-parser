var test = require("tape");
var Parser = require("../");

test("=== String Matches ===", function(_test) {
	_test.test("find single string match", function(t) {
		t.plan(1);
		var p = new Parser();
		p.addRule("findme");
		t.deepEqual(p.toTree("this should findme here."), [
			{ type: "text", text: "this should " },
			{ type: "text", text: "findme" },
			{ type: "text", text: " here." }
		], "trees match");
	});

	_test.test("finds multiple string matches", function(t) {
		t.plan(1);
		var p = new Parser();
		p.addRule("findme");
		t.deepEqual(p.toTree("this should findmefindme here and findme here too."), [
			{ type: "text", text: "this should " },
			{ type: "text", text: "findme" },
			{ type: "text", text: "findme" },
			{ type: "text", text: " here and " },
			{ type: "text", text: "findme" },
			{ type: "text", text: " here too." }
		], "trees match");
	});

	_test.end();
});

test("=== RegExp Matches ===", function(_test) {
	_test.test("matches basic non-global regexp", function(t) {
		t.plan(1);
		var p = new Parser();
		p.addRule(/findme/);
		t.deepEqual(p.toTree("this should findmefindme here."), [
			{ type: "text", text: "this should " },
			{ type: "text", text: "findme", groups: [] },
			{ type: "text", text: "findme", groups: [] },
			{ type: "text", text: " here." }
		], "trees match");
	});

	_test.test("matches basic global regexp", function(t) {
		t.plan(1);
		var p = new Parser();
		p.addRule(/findme/g);
		t.deepEqual(p.toTree("this should findmefindme here."), [
			{ type: "text", text: "this should " },
			{ type: "text", text: "findme", groups: [] },
			{ type: "text", text: "findme", groups: [] },
			{ type: "text", text: " here." }
		], "trees match");
	});

	_test.test("matches regexp with groups", function(t) {
		t.plan(1);
		var p = new Parser();
		p.addRule(/(find)(me)/g);
		t.deepEqual(p.toTree("this should findmefindme here."), [
			{ type: "text", text: "this should " },
			{ type: "text", text: "findme", groups: ["find","me"] },
			{ type: "text", text: "findme", groups: ["find","me"] },
			{ type: "text", text: " here." }
		], "trees match");
	});

	_test.end();
});

test("=== Function Matches ===", function(_test) {
	_test.test("matches single index,length pair", function(t) {
		t.plan(1);
		var p = new Parser();
		p.addRule(function(str) {
			var i = str.indexOf("findme");
			if (i < 0) return [];
			return [ i, 6 ];
		});
		t.deepEqual(p.toTree("this should findmefindme here."), [
			{ type: "text", text: "this should " },
			{ type: "text", text: "findme" },
			{ type: "text", text: "findme" },
			{ type: "text", text: " here." }
		], "trees match");
	});

	_test.test("matches multiple index,length pairs", function(t) {
		t.plan(1);
		var p = new Parser();
		p.addRule(function(str) {
			var i = str.indexOf("findme");
			var m = [];
			while (i >= 0) {
				m.push([ i, 6 ]);
				i = str.indexOf("findme", i + 1);
			}
			return m;
		});
		t.deepEqual(p.toTree("this should findmefindme here."), [
			{ type: "text", text: "this should " },
			{ type: "text", text: "findme" },
			{ type: "text", text: "findme" },
			{ type: "text", text: " here." }
		], "trees match");
	});

	_test.end();
});
