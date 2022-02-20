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

  test("mapArguments", () => {
    let myTable = new TruthTable()
      .true("P(a)", "Q(_x)")
      .mapArguments({ _x: "b", a: "b" });

    expect(myTable.evaluate("P(a)")).toBeUndefined();
    expect(myTable.evaluate("Q(_x)")).toBeUndefined();
    expect(myTable.evaluate("P(b)")).toBe(true);
    expect(myTable.evaluate("Q(b)")).toBe(true);
  });
});
