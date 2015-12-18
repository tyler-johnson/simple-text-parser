# Simple Text Parser

This is a very simple text parser written in Javascript. It's based around strings and regular expressions so it's highly customizable, synchronous and relatively fast.

## Install

Install via NPM and use it in your package of choice. This package is compatible with the browser, but it must be built with Browserify or another JS bundler that supports node modules.

```sh
npm i simple-text-parser --save
```

## Usage

The STP package reveals a `Parser` class. Create a new instance from it.

```javascript
var Parser = require("simple-text-parser");
var parser = new Parser();
```

## Examples

STP works by taking a plain text string and searching it for substrings and regular expressions. When a `match` is found, it is parsed out into a tree and replaced.

Let's start by defining a parsing rule. Say we want to parse some text for hash tags (`#iamahashtag`) and replace it with some custom html:

```javascript
// Define a rule using a regular expression
parser.addRule(/\#[\S]+/ig, function(tag) {
	// Return the tag minus the `#` and surrond with html tags
	return "<span class=\"tag\">" + tag.substr(1) + "</span>";
});
```

Now lets render some text using our rule and output the resulting string:

```javascript
parser.render("Some text #iamahashtag foo bar.");
```

becomes...

```html
Some text <span class="tag">iamahashtag</span> foo bar.
```

Of course we can also parse some text into an object tree for more custom handling and to retrieve the parsed data:

```javascript
parser.toTree("Some text #iamahashtag foo bar.");
```

outputs...

```javascript
[ { type: 'text', text: 'Some text ' },
  { type: 'text',
    text: '<span class="tag">iamahashtag</span>' },
  { type: 'text', text: ' foo bar.' } ]
```

Of course a `type` of `text` on a tag isn't helpful when specifically trying to parse out tags. Let's modify our parsing rule to be more specific:

```javascript
// Define a rule using a regular expression
// RegExp capture groups are passed as extra arguments
parser.addRule(/\#([\S]+)/ig, function(tag, clean_tag) {
	// create the replacement text with surrounding html tags
	var text = "<span class=\"tag\">" + clean_tag + "</span>";

	// return an object describing this tag
	return { type: "tag", text: text, tag: clean_tag };
});
```

Now lets rerun `render()` and `toTree()` on the original text. Notice that `render()` outputs the same thing as before, but `toTree()` includes the custom meta data.

```html
Some text <span class="tag">iamahashtag</span> foo bar.
```

```javascript
[ { type: 'text', text: 'Some text ' },
  { type: 'tag',
    text: '<span class="tag">iamahashtag</span>',
    tag: 'iamahashtag' },
  { type: 'text', text: ' foo bar.' } ]
```

## API Documentation

### Instance Methods

These methods can be called on objects returned from `new Parser()`.

#### parser.addRule()

Add a parsing rule.

```javascript
parser.addRule(match, replace);
```

* `match` (String, RegExp, Function) - The search to perform. If a string, it is searched for exactly. If a regular expression, a simple match is performed and any capture groups are passed to `replace`. If a function, it is called with a single argument, the full string passed to `render()`, and should return an array with an index and length of the match.
* `replace` (String, Function, Undefined) - Replaces the match when found. If a string, it replaces exactly. Functions are called with matched substrings and possibly any regular expression capture groups. The function should return a string to replace with or an object representing a tree node. This argument is optional and when not provided the matched content is preserved.

#### parser.addPreset()

Registers a preset rule within the instance.

```javascript
parser.addPreset(name, replace);
```

* `name` (String) - The string id of the preset as declared by `Parser.registerPreset()`. This will be the node's `type` when returned by `toTree()`.
* `replace` (String, Function) - Replaces the match when found. Same as the `replace` in `addRule()`.

#### parser.toTree()

Returns the parsed string as an array of objects describing each part. Every part includes at least a `type` and `text` key. `type` defaults to `"text"` but could be any value as returned by a `replace`. The `text` key is used to replaced the matched string by `render()`.

```javascript
parser.toTree(str);
```

* `str` (String) - A plain text string to parse.

#### parser.render()

Returns a parsed string with all rules replaced.

```javascript
parser.render(str);
```

* `str` (String) - A plain text string to parse and replace.

### Class Methods

These methods can be called directly from the `Parser` class.

#### Parser.registerPreset()

Register a new preset rule. This allows STP to be extended globally. Presets don't handle the replacing, only the matching. STP comes with three pre-included presets: `tag`, `url`, and `email`.

```javascript
Parser.registerPreset(name, match);
```

* `name` (String) - The string id of the preset. This will become the node's `type` when returned by `toTree()`.
* `match` (String, RegExp, Function) - The search to perform. Same as the `replace` in `addRule()`.
