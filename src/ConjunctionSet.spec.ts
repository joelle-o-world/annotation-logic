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
    expect(() => set.healthCheck()).not.toThrow();

    set.false("[=33] is round");
    expect(() => set.healthCheck()).toThrow();
  });

  test("finding external contradictions", () => {
    const set = new ConjunctionSet();
    for (let i = 0; i < 100; ++i) set.true(`[=${i}] is round`);
    const b = new ConjunctionSet();
    expect(() => set.checkForContradictionsWith(b)).not.toThrow();
    b.false("[=33] is round");
    expect(() => set.checkForContradictionsWith(b)).toThrow();
  });

  describe("findMappings", () => {
    test("finds simple mappings", () => {
      const set = new ConjunctionSet().true(
        "[=a] is a circle",
        "[=b] is a broccoli"
      );

      expect([...set.findMappings(["x"], "[=x] is a circle")]).toContainEqual({
        x: "a",
      });
      expect([...set.findMappings(["x"], "[=x] is a broccoli")]).toContainEqual(
        {
          x: "b",
        }
      );
    });

    test("rejects unassigned arguments", () => {
      expect(() => [
        ...new ConjunctionSet()
          .true("[=a] likes [=b]", "[=a] likes [=c]")
          .findMappings(["x"], "[=x] likes []"),
      ]).toThrow();
    });

    describe("find mappings from another conjunction set", () => {
      test("Ignore mappings that lead to contradictions between mapped set and base set", () => {
        let set1 = new ConjunctionSet()
          .true("[=a] is a string")
          .true("[=a] is orange")
          .true("[=b] is a string")
          .false("[=b] is orange");

        let set2 = new ConjunctionSet()
          .true("[=x] is a string")
          .true("[=x] is orange");

        expect([...set1.findMappings(["x"], set2)]).toStrictEqual([{ x: "a" }]);
      });

      test("Rejects mappings that lead to internal contradictions in mapped set", () => {
        let set1 = new ConjunctionSet()
          .true("[=a] is a string")
          .true("[=a] is orange")
          .true("[=b] is a string")
          .true("[=b] is orange");

        let set2 = new ConjunctionSet()
          .true("[=x] is a string")
          .true("[=x] is orange")
          .false("[=a] is a string");

        expect([...set1.findMappings(["x"], set2)]).toStrictEqual([{ x: "b" }]);
      });
    });
  });
});
