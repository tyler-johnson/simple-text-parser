# Simple Text Parser

This is a dead simple text parser written in Javascript. It's based around strings and regular expressions so it's highly customizable, synchronous and relatively fast.

## Install

Requires Node.js and NPM. Simply install it into your package of choice.

	npm install simple-text-parser --save

The `--save` will tell npm to add it to your `package.json`.

## Usage

The STP package is a `Parser` class. Create a new object from it.

```javascript
var Parser = require("simple-text-parser"),
    parser = new Parser();
```

## Examples

STP works by taking a plain text `String` and searching it for substrings and regular expressions. When a `match` is found, it is parsed out into a tree and replaced.

Let's start by defining a parsing rule. Say we want to parse some text for hash tags (`#iamahashtag`) and replace it with some custom html:

```javascript
// Define a rule using a regular expression
parser.addRule(/\#[\S]+/ig, function(tag) {
	// Return the tag minus the `#` and surrond with html tags
	return "<span class=\"tag\">" + tag.substr(1) + "</span>";
});
```

Now lets parse some text and output the resulting string:

```javascript
parser.parse("Some text #iamahashtag foo bar.");
```

becomes...

```html
Some text <span class="tag">iamahashtag</span> foo bar.
```

Of course we can also parse some text into an `Object` tree for more custom handling and to retrieve the parsed data:

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

Of course a `type` of `text` on a tag isn't helpful when specifically trying to parse out tags. Let's modify our parsing rule to be more specfic:

```javascript
// Define a rule using a regular expression
parser.addRule(/\#[\S]+/ig, function(tag) {
	// Get the tag minus the `#`
	var clean_tag = tag.substr(1);
	
	// create the replacement text with surronding html tags
	var text = "<span class=\"tag\">" + clean_tag + "</span>";
	
	// return an object describing this tag
	return { type: "tag", text: text, tag: clean_tag };
});
```

Now lets rerun `parse()` and `toTree()` on the original text. Notice that `parse()` outputs the same thing as before, but `toTree()` includes the custom meta data.

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

### Class Methods

These methods can be called directly from the `Parser` class.

#### Parser.registerPreset()

Register a new preset rule. This allows STP to be extended globally. Presets don't handle the replacing, only the matching. STP comes with three pre-included presets: `tag`, `url`, and `email`.

```javascript
Parser.registerPreset(name, match);
```

* `name` (String) - The string id of the preset. Also the `type`.
* `match` (String, RegExp, Function) - The search to perform. 

### Instance Methods

These methods can be called on objects returned from `new Parser()`.

#### parser.addRule()

Add a parsing rule.

```javascript
parser.addRule(match, replace);
```

* `match` (String, RegExp, Function) - The search to perform. If a `String`, it is searched for exactly. If `RegExp`, a simple match is performed. If `Function`, it is called with a single argument: the full string passed to `parse()`.
* `replace` (String, Function) - Replaces the match when found. When a `String`, it is replaces exactly. `Function`s are called with matched substring as the only argument.

#### parser.addPreset()

Registers a preset rule within the instance.

```javascript
parser.addPreset(name, replace);
```

* `name` (String) - The string id of the preset. Also the `type`.
* `replace` (String, Function) - Replaces the match when found.

#### parser.toTree()

Returns the parsed string as an array of objects describing each part. Every part includes at least a `type` and `text` key. `type` defaults to text. The `text` key is used to replaced the matched string.

```javascript
parser.toTree(str);
```

* `str` (String) - A plain text string to parse.

#### parser.parse()

Returns a parsed string with all rules replaced.

```javascript
parser.parse(str);
```

* `str` (String) - A plain text string to parse.