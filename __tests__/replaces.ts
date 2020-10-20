import { Parser } from "../src";

describe("Replaces", function () {
  it("replaces several rules altogether", function () {
    expect.assertions(3);

    const p = new Parser();
    p.addRule("string", "STRING", "string");
    p.addRule(/r(egex)p/, function (str, group) {
      expect(group).toBe("egex");
      return { type: "find", text: str };
    });

    const tree = p.toTree("this should replace a string and regexp.");

    expect(tree).toEqual([
      { type: "text", text: "this should replace a " },
      { type: "string", text: "STRING" },
      { type: "text", text: " and " },
      { type: "find", text: "regexp" },
      { type: "text", text: "." },
    ]);

    expect(Parser.renderTree(tree)).toBe("this should replace a STRING and regexp.");
  });

  describe("String Replaces", function () {
    it("replaces matches with string", function () {
      const p = new Parser();
      p.addRule("findme", "replaced");

      expect(p.render("this should findme here and findme over here.")).toBe(
        "this should replaced here and replaced over here."
      );
    });

    it("replaces preset", function () {
      const p = new Parser();
      p.addPreset("tag", "TAGGED");

      expect(p.render("this should #findme here and #findme over here.")).toBe(
        "this should TAGGED here and TAGGED over here."
      );
    });
  });

  describe("Function Replaces", function () {
    it("replaces with returned contents", function () {
      const p = new Parser();
      p.addRule("findme", function () {
        return "replaced";
      });
      expect(p.render("this should findme here and findme over here.")).toBe(
        "this should replaced here and replaced over here."
      );
    });

    it("replaces tree with object when returned", function () {
      const p = new Parser();
      p.addRule("findme", function () {
        return { type: "find", value: "me", text: "replaced" };
      });

      expect(p.toTree("this should findme here.")).toEqual([
        { type: "text", text: "this should " },
        { type: "find", value: "me", text: "replaced" },
        { type: "text", text: " here." },
      ]);

      expect(p.render("this should findme here.")).toBe("this should replaced here.");
    });

    it("replaces preset", function () {
      const p = new Parser();
      p.addPreset("tag", function () {
        return { type: "find", value: "me", text: "replaced" };
      });

      expect(p.toTree("this should #findme here.")).toEqual([
        { type: "text", text: "this should " },
        { type: "find", value: "me", text: "replaced" },
        { type: "text", text: " here." },
      ]);

      expect(p.render("this should #findme here.")).toBe("this should replaced here.");
    });

    it("calls replace function with matched string", function () {
      expect.assertions(1);
      const p = new Parser();

      p.addRule("findme", function (arg) {
        expect(arg).toBe("findme");
        return arg;
      });

      p.render("this should findme here.");
    });

    it("calls replace function with regexp groups", function () {
      expect.assertions(2);
      const p = new Parser();

      p.addRule(/(find)(me)/, function (arg, m1, m2) {
        expect(m1).toBe("find");
        expect(m2).toBe("me");
        return arg;
      });

      p.render("this should findme here.");
    });
  });
});
