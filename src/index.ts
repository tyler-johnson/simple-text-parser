export interface Node {
  type: string;
  text: string;
  [key: string]: unknown;
}

export namespace Node {
  export function is(r: any): r is Node {
    return r != null && typeof r.type === "string" && typeof r.text === "string";
  }
}

export type Match = string | RegExp | Match.Location | Match.Location[] | Match.Function;

export namespace Match {
  export type Location = [number, number];

  export namespace Location {
    // eslint-disable-next-line no-shadow
    export function is(loc: any): loc is Location {
      return Array.isArray(loc) && loc.length === 2 && typeof loc[0] === "number" && typeof loc[1] === "number";
    }
  }

  export type Function = (str: string) => string | RegExp | Location | Location[];

  export function is(val: any): val is Match {
    return typeof val === "string" || typeof val === "function" || isRegExp(val);
  }
}

export type Replace = string | Replace.Function;

export namespace Replace {
  export type Function = (match: string, ...groups: string[]) => Partial<Node> | string;

  export function is(val: any): val is Replace {
    return typeof val === "string" || typeof val === "function";
  }
}

export interface Rule {
  match: Match;
  type?: string;
  replace?: Replace;
}

export namespace Rule {
  export function is(r: any): r is Rule {
    return (
      r != null &&
      Match.is(r.match) &&
      (r.type == null || typeof r.type === "string") &&
      (r.replace == null || Replace.is(r.replace)) &&
      typeof r !== "string" // b/c holy cow a string actually fits the rule type
    );
  }
}

// isRegExp adopted from sindresorhus/is-regexp
function isRegExp(value: any): value is RegExp {
  return Object.prototype.toString.call(value) === "[object RegExp]";
}

export class Parser {
  static presets = new Map<string, Match>([
    ["tag", /#[\S]+/gi],
    [
      "email",
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi,
    ],
    [
      "url",
      /(?:(?:https?):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?/gi,
    ],
  ]);

  /**
   * Register a new global preset rule. Presets don't handle the replacing, only the matching. There are three
   * pre-included presets: `tag`, `url`, and `email`.
   */
  static registerPreset(type: string, match: Match) {
    if (typeof type !== "string" || !type) {
      throw new TypeError("Expecting non-empty string for preset type.");
    }

    if (!Match.is(match)) {
      throw new TypeError("Expecting a string, regexp or function for preset match.");
    }

    Parser.presets.set(type, match);
  }

  rules: Rule[] = [];

  /** Add a rule to this parser. A rule consists of a match and optionally, a replace and type. */
  addRule(match: Match, replace?: Replace, type?: string): this;
  /** Add a rule object to this parser. */
  addRule(rule: Rule): this;

  addRule(match: Match | Rule, replace?: Replace, type?: string) {
    if (Rule.is(match)) {
      this.rules.push(match);
      return this;
    }

    if (!Match.is(match)) {
      throw new TypeError("Expecting string, regex, or function for match.");
    }

    if (replace != null && !Replace.is(replace)) {
      throw new TypeError("Expecting string or function for replace.");
    }

    this.rules.push({ match, type, replace });
    return this;
  }

  /**
   * Add a registered global preset rule within this parser and give it a replace. The preset must first be registered
   * using `Parser.registerPreset()` before it can be used with this method.
   */
  addPreset(type: string, replace?: Replace) {
    const match = Parser.presets.get(type);
    if (!match) throw new Error(`Preset '${type}' hasn't been registered on Parser.`);

    this.rules.push({ match, type, replace });
    return this;
  }

  private _replace(str: string, opts: { defaultType?: string; replace?: Replace; groups?: string[] } = {}): Node {
    const { defaultType = "text", replace, groups } = opts;

    let value: Partial<Node> | string;
    if (typeof replace === "function") {
      value = replace(str, ...(groups || []));
    } else if (typeof replace === "string") {
      value = replace;
    } else {
      value = str;
    }

    if (typeof value === "string") {
      const node: Node = { type: defaultType, text: value };
      if (groups) node.groups = groups.slice(0);
      return node;
    }

    // in case the user is returning some kind of custom object
    if (Node.is(value)) return value;

    return { type: defaultType, text: str, ...value };
  }

  private _toTree(str: string) {
    const tree: Array<Node | string> = [];
    if (!str) return tree;

    for (const { match, type: defaultType, replace } of this.rules) {
      let m = typeof match === "function" ? match(str) : match;
      const opts = { replace, defaultType };

      if (typeof m === "string") {
        if (str.indexOf(m) < 0) continue;

        let si = 0,
          i;
        while ((i = str.indexOf(m, si)) > -1) {
          tree.push(str.substring(si, i));
          tree.push(this._replace(str.substr(i, m.length), opts));
          si = i + m.length;
        }

        tree.push(str.substr(si));
      } else if (Array.isArray(m)) {
        if (!m.length) continue;
        if (Match.Location.is(m)) m = [m];

        let si = 0;
        for (const loc of m) {
          if (!Match.Location.is(loc)) continue;
          const [index, length] = loc;

          if (index < si) break;
          tree.push(str.substring(si, index));
          tree.push(this._replace(str.substr(index, length), opts));
          si = index + length;
        }

        tree.push(str.substr(si));
      } else if (isRegExp(m)) {
        let rmatch = m.exec(str);
        if (!rmatch) continue;

        let i = 0;
        while (rmatch != null) {
          tree.push(str.substring(i, rmatch.index));
          const substr = str.substr(rmatch.index, rmatch[0].length);
          tree.push(this._replace(substr, { ...opts, groups: Array.from(rmatch).slice(1) }));
          i = rmatch.index + rmatch[0].length;

          rmatch = (m.flags || "").indexOf("g") >= 0 ? m.exec(str) : null;
        }

        tree.push(str.substr(i));
      }

      // only the first matching rule is run
      break;
    }

    if (!tree.length) return [{ type: "text", text: str }];

    return tree;
  }

  /**
   * Returns the parsed string as an array of nodes. Every node includes at least `type` and `text` properties. `type`
   * defaults to `"text"` but could be any value as returned by `replace`. The `text` key is used to replaced the
   * matched string by `render()`.
   */
  toTree(str: string) {
    const tree = this._toTree(str);
    const result: Node[] = [];

    for (const val of tree) {
      if (typeof val === "string") {
        result.push(...this.toTree(val));
      } else {
        result.push(val);
      }
    }

    return result;
  }

  /**
   * Returns a string derived from the text property on a list of nodes.
   */
  static renderTree(tree: Node[]) {
    let result = "";

    for (const node of tree) {
      if (typeof node.text === "string") {
        result += node.text;
      }
    }

    return result;
  }

  /**
   * Returns a parsed string with all matches replaced.
   */
  render(str: string) {
    return Parser.renderTree(this.toTree(str));
  }
}

export default Parser;
