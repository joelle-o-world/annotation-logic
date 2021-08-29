import ConjunctionSet from "./ConjunctionSet";

describe("ConjunctionSet", () => {
  test("Evaluating statements", () => {
    const set = new ConjunctionSet().true("[=a] is small", "[=b] is small");
    expect(set.evaluate("[he =a] is small")).toBe(true);
    expect(set.evaluate("[=b] is small")).toBe(true);
    expect(set.evaluate("[=c] is small")).toBe(undefined);
  });

  test("Evaluating statements without arguments", () => {
    const set = new ConjunctionSet().true("the earth is flat");
    expect(set.evaluate("the earth is flat")).toBe(true);
    expect(set.evaluate("there is a god")).toBe(undefined);
  });

  test("Finding internal contradictions", () => {
    const set = new ConjunctionSet();
    for (let i = 0; i < 100; ++i) set.true(`[=${i}] is round`);
    expect(() => set.checkForInternalContradictions()).not.toThrow();

    set.false("[=33] is round");
    expect(() => set.checkForInternalContradictions()).toThrow();
  });

  test("finding external contradictions", () => {
    const set = new ConjunctionSet();
    for (let i = 0; i < 100; ++i) set.true(`[=${i}] is round`);
    const b = new ConjunctionSet();
    expect(() => set.checkForContradictionsWith(b)).not.toThrow();
    b.false("[=33] is round");
    expect(() => set.checkForContradictionsWith(b)).toThrow();
  });

  test("Finding mappings", () => {
    const set = new ConjunctionSet().true(
      "[=a] is a circle",
      "[=b] is a broccoli"
    );

    expect([...set.getMappings(["x"], "[=x] is a circle")]).toContainEqual({
      x: "a",
    });
    expect([...set.getMappings(["x"], "[=x] is a broccoli")]).toContainEqual({
      x: "b",
    });
  });
});
