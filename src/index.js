import * as _ from "lodash";
import {presets,register as registerPreset} from "./presets";
import {ismatch,isreplace,istype} from "./utils";

export default class Parser {
	constructor() {
		this.rules = [];
	}

	addRule(match, replace) {
		if (!ismatch(match)) throw new TypeError("Expecting string, regex, or function for match.");
		if (!isreplace(replace)) throw new TypeError("Expecting string or function for replace.");
		this.rules.push({ match, replace });
		return this;
	}

	addPreset(name, replace) {
		if (!_.has(presets, name)) throw new Error(`Preset ${name} doesn't exist.`);

		this.rules.push({
			match: presets[name],
			replace: function(str) {
				let ret = { type: name, value: str, text: str };

				if (typeof replace === "function") {
					let val = replace(str);
					if (typeof val === "object") _.assign(ret, val);
					else if (typeof val === "string") ret.text = val;
				}

				return ret;
			}
		});

		return this;
	}

	toTree(str) {
		let tree = [];
		let match = this.rules.some((rule) => {
			let m = rule.match;

			let replace = (str, groups) => {
				let r = rule.replace;
				let v, args;

				switch (istype(r)) {
					case "function":
						args = [str];
						if (groups) args = args.concat(groups);
						v = r.apply(this, args);
						break;
					case "string":
						v = r;
						break;
					default:
						v = str;
						break;
				}

				if (typeof v === "string") {
					v = { type: "text", text: v };
					if (groups) v.groups = groups.slice(0);
				}

				return v;
			};

			let si, i, rmatch;

			switch (istype(m)) {
				case "string":
					if (str.indexOf(m) < 0) return;

					si = 0;
					while ((i = str.indexOf(m, si)) > -1) {
						tree.push(str.substring(si, i));
						tree.push(replace(str.substr(i, m.length)));
						si = i + m.length;
					}

					tree.push(str.substr(si));
					break;

				case "regex":
					rmatch = m.exec(str);
					if (!rmatch) return;
					i = 0;

					while (rmatch != null) {
						tree.push(str.substring(i, rmatch.index));
						let substr = str.substr(rmatch.index, rmatch[0].length);
						tree.push(replace(substr, _.toArray(rmatch).slice(1)));
						i = rmatch.index + rmatch[0].length;

						rmatch = (rmatch.flags || "").indexOf("g") >= 0 ? m.exec(str) : null;
					}

					tree.push(str.substr(i));
					break;

				case "function":
					rmatch = m(str);
					si = 0;
					if (!Array.isArray(rmatch)) return;
					if (rmatch.filter(_.isNumber).length === 2) rmatch = [ rmatch ];
					if (!rmatch.length) return;

					rmatch.forEach((part) => {
						part = _.filter(part, _.isNumber);
						if (_.size(part) !== 2) return;
						if (part[0] < si) return;

						tree.push(str.substring(si, part[0]));
						tree.push(replace(str.substr(part[0], part[1])));
						si = part[0] + part[1];
					});

					tree.push(str.substr(si));
					break;
			}

			return true;
		});

		if (!match) return [ { type: "text", text: str } ];

		return tree.reduce((t, item) => {
			if (item) {
				t = t.concat(typeof item === "string" ? this.toTree(item) : item);
			}

			return t;
		}, []);
	}

	render(str) {
		return this.toTree(str).map((part) => {
			if (typeof part === "string") return part;
			else if (typeof part === "object" && part) return part.text;
			else return "";
		}).join("");
	}

	parse(str) {
		console.warn(`Parser#parse() has been deprecated and will be removed in a future release. Please use Parser#render() instead.`);

		return this.render(str);
	}
}

Parser.presets = presets;
Parser.registerPreset = registerPreset;
