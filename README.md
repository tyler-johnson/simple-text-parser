# Simple Text Parser

This is a very simple text parser written in TypeScript. It's based around strings and regular expressions so it's highly customizable, synchronous, and relatively fast.

## Install

Install via NPM/Yarn and use it in your package of choice. This package is compatible with the browser.

```bash
npm i simple-text-parser
```

```bash
yarn add simple-text-parser
```

## Usage

The simple-text-parser package exports a `Parser` class. Create a new instance from it.

```javascript
import { Parser } from "simple-text-parser";

const parser = new Parser();
```

## Example

This library works by taking a plain text string and searching it for substrings and regular expressions. When a `match` is found, it is parsed out into a tree and replaced.

Let's start by defining a parsing rule. Say we want to parse some text for hash tags (`#iamahashtag`) and replace it with some custom html:

```javascript
// Define a rule using a regular expression
parser.addRule(/\#[\S]+/gi, function (tag) {
  // Return the tag minus the `#` and surrond with html tags
  return '<span class="tag">' + tag.substr(1) + "</span>";
});
```

Now let's render some text using our rule and output the resulting string:

```javascript
parser.render("Some text #iamahashtag foo bar.");
```

becomes...

```html
Some text <span class="tag">iamahashtag</span> foo bar.
```

Of course we can also parse some text into an array of nodes for more custom handling and to retrieve the parsed data:

```javascript
parser.toTree("Some text #iamahashtag foo bar.");
```

outputs...

```javascript
[
  { type: "text", text: "Some text " },
  { type: "text", text: '<span class="tag">iamahashtag</span>' },
  { type: "text", text: " foo bar." },
];
```

Of course a `type` of `text` on a tag isn't helpful when specifically trying to parse out tags. Let's modify our parsing rule to be more specific:

```javascript
// Define a rule using a regular expression
// RegExp capture groups are passed as extra arguments
parser.addRule(/\#([\S]+)/gi, function (tag, clean_tag) {
  // create the replacement text with surrounding html tags
  var text = '<span class="tag">' + clean_tag + "</span>";

  // return a node describing this tag
  return { type: "tag", text: text, tag: clean_tag };
});
```

Now lets rerun `render()` and `toTree()` on the original text. Notice that `render()` outputs the same thing as before, but `toTree()` includes the custom meta data.

```html
Some text <span class="tag">iamahashtag</span> foo bar.
```

```javascript
[
  { type: "text", text: "Some text " },
  {
    type: "tag",
    text: '<span class="tag">iamahashtag</span>',
    tag: "iamahashtag",
  },
  { type: "text", text: " foo bar." },
];
```

## API Documentation

### Instance Methods

These methods can be called on objects returned from `new Parser()`.

#### parser.addRule()

Add a rule to this parser. A rule consists of a match and optionally a replace.

```
addRule(match: Match, replace?: Replace): this
```

- `match` - The search to perform. If a string, it is searched for exactly. If a regular expression, a simple match is performed and any capture groups are passed to `replace`. If a function, it is called with a single argument, the full string passed to `render()`, and should return an array with an index and length of the match.
- `replace` - Replaces the match when found. If a string, it replaces exactly. Functions are called with matched substrings and possibly any regular expression capture groups. The function should return a string to replace with or an object representing a tree node. This argument is optional and when not provided the matched content is preserved.

#### parser.addPreset()

Add a registered global preset rule within this parser and give it a replace. The preset must first be registered using `Parser.registerPreset()` before it can be used with this method.

```
addPreset(name: string, replace?: Replace): this
```

- `name` - The string id of the preset as declared by `Parser.registerPreset()`. This will be the node's `type` when returned by `toTree()`.
- `replace` - Replaces the match when found. Same as the `replace` in `addRule()`.

#### parser.toTree()

Returns the parsed string as an array of nodes. Every node includes at least `type` and `text` properties. `type` defaults to `"text"` but could be any value as returned by `replace`. The `text` key is used to replaced the matched string by `render()`.

```
toTree(str: string): Node[]
```

- `str` - A plain text string to parse.

#### parser.render()

Returns a parsed string with all matches replaced.

```
render(str: string): string
```

- `str` - A plain text string to parse and replace.

### Class Methods

These methods can be called from the `Parser` class.

#### Parser.registerPreset()

Register a new global preset rule. Presets don't handle the replacing, only the matching. There are three pre-included presets: `tag`, `url`, and `email`.

```
static registerPreset(name: string, match: Match): void
```

- `name` - The string id of the preset. This will become the node's `type` when returned by `toTree()`.
- `match` - The search to perform. Same as the `replace` in `addRule()`.
