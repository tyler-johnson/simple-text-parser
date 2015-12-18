import * as _ from "lodash";

let special = { regex: _.isRegExp, array: _.isArray };
export function istype(val, types) {
	if (_.isArray(types)) {
		return types.some((type) => {
			return _.has(special, type) ? special[type](val) : typeof val === type;
		});
	} else if (typeof types === "string") {
		return istype(val, [ types ]);
	} else {
		let type = typeof val;
		_.some(special, (fnc, t) => {
			if (fnc(val)) return (type = t);
		});
		return type;
	}
}

export function ismatch(val) {
	return istype(val, [ "string", "regex", "function" ]);
}

export function isreplace(val) {
	return istype(val, [ "string", "function", "undefined" ]);
}
