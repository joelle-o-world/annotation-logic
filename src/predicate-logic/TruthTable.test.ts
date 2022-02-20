import TruthTable from "./TruthTable";

describe("TruthTable", () => {
  test("We can assign some truth values then look them up", () => {
    expect(new TruthTable().true("P(a,b)").evaluate("P(a,b)")).toBe(true);
    expect(
      new TruthTable().true("P(a,b)", "Q()").false("P(a, b)").evaluate("P(a,b)")
    ).toBe(false);
  });

  test("Finding mappings for a single sentence", () => {
    const myTable = new TruthTable().true("P(a)", "P(b)", "Q(c)");
    expect([...myTable.findMappings("P(_x)")]).toStrictEqual([
      { _x: "a" },
      { _x: "b" },
    ]);
  });
});
