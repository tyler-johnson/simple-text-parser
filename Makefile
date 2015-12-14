BIN = ./node_modules/.bin
SRC = $(wildcard src/*)
OUT = stp.js

build: $(OUT)

define ROLLUP
require("rollup").rollup({
	entry: "$<",
	plugins: [
		require("rollup-plugin-babel")({
			exclude: 'node_modules/**'
		})
	]
}).then(function(bundle) {
	var result = bundle.generate({
		format: "cjs"
	});
	process.stdout.write(result.code);
}).catch(function(e) {
	process.nextTick(function() {
		throw e;
	});
});
endef

export ROLLUP

$(OUT): src/index.js $(SRC)
	# $< -> $@
	@node -e "$$ROLLUP" > $@

clean:
	rm $(OUT)

.PHONY: build
