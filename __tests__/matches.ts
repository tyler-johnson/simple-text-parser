import { Parser, Match } from "../src";

describe("Matches", function () {
  it("matches several rules altogether", function () {
    const p = new Parser();
    p.addRule("string");
    p.addRule(/r(egex)p/);
    p.addRule(function (str) {
      const i = str.indexOf("func");
      if (i < 0) return [];
      return [i, 4];
    });

    expect(p.toTree("this should match a string, regexp, and func.")).toEqual([
      { type: "text", text: "this should match a " },
      { type: "text", text: "string" },
      { type: "text", text: ", " },
      { type: "text", text: "regexp", groups: ["egex"] },
      { type: "text", text: ", and " },
      { type: "text", text: "func" },
      { type: "text", text: "." },
    ]);
  });

  describe("String", function () {
    it("find single string match", function () {
      const p = new Parser();
      p.addRule("findme");

      expect(p.toTree("this should findme here.")).toEqual([
        { type: "text", text: "this should " },
        { type: "text", text: "findme" },
        { type: "text", text: " here." },
      ]);
    });

    it("finds multiple string matches", function () {
      const p = new Parser();
      p.addRule("findme");

      expect(p.toTree("this should findmefindme here and findme here too.")).toEqual([
        { type: "text", text: "this should " },
        { type: "text", text: "findme" },
        { type: "text", text: "findme" },
        { type: "text", text: " here and " },
        { type: "text", text: "findme" },
        { type: "text", text: " here too." },
      ]);
    });
  });

  describe("RegExp", function () {
    it("matches basic non-global regexp", function () {
      const p = new Parser();
      p.addRule(/findme/);

      expect(p.toTree("this should findmefindme here.")).toEqual([
        { type: "text", text: "this should " },
        { type: "text", text: "findme", groups: [] },
        { type: "text", text: "findme", groups: [] },
        { type: "text", text: " here." },
      ]);
    });

    it("matches basic global regexp", function () {
      const p = new Parser();
      p.addRule(/findme/g);
      expect(p.toTree("this should findmefindme here.")).toEqual([
        { type: "text", text: "this should " },
        { type: "text", text: "findme", groups: [] },
        { type: "text", text: "findme", groups: [] },
        { type: "text", text: " here." },
      ]);
    });

    it("matches regexp with groups", function () {
      const p = new Parser();
      p.addRule(/(find)(me)/g);
      expect(p.toTree("this should findmefindme here.")).toEqual([
        { type: "text", text: "this should " },
        { type: "text", text: "findme", groups: ["find", "me"] },
        { type: "text", text: "findme", groups: ["find", "me"] },
        { type: "text", text: " here." },
      ]);
    });
  });

  describe("Function", function () {
    it("matches single index,length pair", function () {
      const p = new Parser();
      p.addRule(function (str) {
        const i = str.indexOf("findme");
        if (i < 0) return [];
        return [i, 6];
      });

      expect(p.toTree("this should findmefindme here.")).toEqual([
        { type: "text", text: "this should " },
        { type: "text", text: "findme" },
        { type: "text", text: "findme" },
        { type: "text", text: " here." },
      ]);
    });

    it("matches multiple index,length pairs", function () {
      const p = new Parser();
      p.addRule(function (str) {
        const m: Match.Location[] = [];

        for (let i = str.indexOf("findme"); i >= 0; i = str.indexOf("findme", i + 1)) {
          m.push([i, 6]);
        }

        return m;
      });

      expect(p.toTree("this should findmefindme here.")).toEqual([
        { type: "text", text: "this should " },
        { type: "text", text: "findme" },
        { type: "text", text: "findme" },
        { type: "text", text: " here." },
      ]);
    });
  });
});
