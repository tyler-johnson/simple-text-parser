_ = require "underscore"
presets = require "./presets"

tc = (val, types) ->
	special = { "regex": _.isRegExp, "array": _.isArray }

	if _.isArray types
		return _.some types, (type) ->
			if _.has(special, type) then return special[type](val)
			else return typeof val is type
	else if _.isString types
		if _.has(special, type) then return special[type](val)
		else return typeof val is type
	else
		type = typeof val
		_.some special, (fnc, t) ->
			if fnc(val) then return type = t
		return type

class Parser
	constructor: () ->
		@rules = []

	addRule: (match, replace) ->
		unless tc(match, [ "string", "regex", "function" ]) then throw new TypeError("Expecting string, regex, or function for match.")
		unless tc(replace, [ "string", "function", "undefined" ]) then throw new TypeError("Expecting string or function for replace.")

		@rules.push { match: match, replace: replace }

	addPreset: (name, replace) ->
		unless _.has(presets, name) then throw new Error "Preset "+name+" doesn't exist."

		@rules.push
			match: presets[name],
			replace: (str) ->
				ret = { type: name, value: str, text: str }

				if _.isFunction replace
					val = replace(str)
					if _.isObject(val) then _.extend ret, val
					else if _.isString(val) then ret.text = val

				return ret

	toTree: (str) ->
		tree = []
		match = _.some @rules, (rule) ->
			m = rule.match

			replace = (str) ->
				r = rule.replace
				v = null

				switch tc r
					when "function" then v = r str
					when "string" then v = r
					else v = str

				if _.isString(v) then v = { type: "text", text: v }

				return v
			
			switch tc m
				when "string"
					unless str.indexOf(m) > -1 then return

					si = 0
					while (i = str.indexOf(m, si)) > -1
						tree.push str.substring si, i
						tree.push replace str.substr i, m.length
						si = i + m.length
					
					tree.push str.substr si

				when "regex"
					unless match = m.exec(str) then return
					i = 0

					while match?
						tree.push str.substring i, match.index
						tree.push replace str.substr match.index, match[0].length
						i = match.index + match[0].length

						match = m.exec(str)

					tree.push str.substr i

				when "function"
					match = m(str)
					si = 0
					unless _.isArray(match) then return
					if _.filter(match, _.isNumber).length is 2 then match = [ match ]

					_.each match, (part) ->
						part = _.filter(part, _.isNumber)
						if _.size(part) isnt 2 then return
						if part[0] < si then return

						tree.push str.substring si, part[0]
						tree.push replace str.substr part[0], part[1]
						si = part[0] + part[1]

					tree.push str.substr si
			
			return true

		unless match then return [ { type: "text", text: str } ]

		tree = _.map tree, (item) =>
			if !item then return
			else if _.isString(item) then return @toTree item
			else return item

		return _.compact _.flatten tree

	parse: (str) ->
		tree = @toTree str

		return _.map(tree, (part) ->
			if _.isString(part) then return part
			else if _.isObject(part) then return part.text
		).join("")

module.exports = Parser