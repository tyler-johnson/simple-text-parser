import { Parser } from "../src";

const matches = {
  string: "replaceme",
  regexp: /replaceme/gi,
  function: () => false,
};

const replaces = {
  string: "replaceme",
  function: (str: string) => str,
  undefined: void 0,
};

describe("Adding Rules", function () {
  for (const [match, mtype] of Object.entries(matches)) {
    it(`registers a global preset with ${mtype} match`, function () {
      Parser.registerPreset(mtype + "_test", match);
    });

    for (const [replace, rtype] of Object.entries(replaces)) {
      it("adds rule with " + mtype + " match and " + rtype + " replace", function () {
        const p = new Parser();
        p.addRule(match, replace);
      });

      it("adds a preset rule to parser with " + rtype + " replace", function () {
        const p = new Parser();
        p.addPreset(mtype + "_test", replace);
      });
    }
  }
});
