import ConjunctionSet from "./ConjunctionSet";

describe("ConjunctionSet", () => {
  test("Evaluating statements", () => {
    const set = new ConjunctionSet().true("[=a] is small", "[=b] is small");
    expect(set.evaluate("[he =a] is small")).toBe(true);
    expect(set.evaluate("[=b] is small")).toBe(true);
    expect(set.evaluate("[=c] is small")).toBe(undefined);
  });

  test("Finding internal contradictions", () => {
    const set = new ConjunctionSet();
    for (let i = 0; i < 100; ++i) set.true(`[=${i}] is round`);
    expect(() => set.checkForInternalContradictions()).not.toThrow();

    set.false("[=33] is round");
    expect(() => set.checkForInternalContradictions()).toThrow();
  });
});
