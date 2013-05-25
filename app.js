var presets = require("./lib/presets"),
	Parser = require('./lib/parser');

Parser.presets = presets;
Parser.registerPreset = function(name, match) {
	presets[name] = match;
}

module.exports = Parser;