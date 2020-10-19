import { Parser } from "../src";

describe("String Replaces", function () {
  it("replaces matches with string", function () {
    const p = new Parser();
    p.addRule("findme", "replaced");

    expect(p.render("this should findme here and findme over here.")).toBe(
      "this should replaced here and replaced over here."
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
