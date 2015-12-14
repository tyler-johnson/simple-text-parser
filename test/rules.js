var _ = require("lodash");
var test = require("tape");
var Parser = require("../");

var matches = {
	string: "replaceme",
	regexp: /replaceme/ig,
	function: function() {}
};

var replaces = {
	string: "replaceme",
	function: function() {},
	"undefined": void 0
};

test("=== Adding Rules ===", function(_test) {
	_.forEach(matches, function(match, mtype) {
		_test.test("registers a global preset with "+mtype+" match", function(t) {
			Parser.registerPreset(mtype+"_test", match);
			t.end();
		});

		_.forEach(replaces, function(replace, rtype) {
			_test.test("adds rule with "+mtype+" match and "+rtype+" replace", function(t) {
				var p = new Parser();
				p.addRule(match, replace);
				t.end();
			});

			_test.test("adds a preset rule to parser with "+rtype+" replace", function(t) {
				var p = new Parser();
				p.addPreset(mtype+"_test",replace);
				t.end();
			});
		});
	});

_test.end();
});
