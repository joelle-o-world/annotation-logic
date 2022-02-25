import AnnotationTruthTable from "./AnnotationTruthTable";

describe("AnnotationTruthTable", () => {
  test("Sentences have `undefined` truth by default", () => {
    expect(new AnnotationTruthTable().evaluate("P[a]")).toBeUndefined();
  });
  test("We can assign a positive truth value then look it up", () => {
    expect(new AnnotationTruthTable().add("P[a][b]").evaluate("P[a][b]")).toBe(
      true
    );
  });
  test("We can assign a negative truth value then look it up", () => {
    let table = new AnnotationTruthTable().add("NOT [P[a][b]]");
    expect(table.evaluate("P[a][b]")).toBe(false);
  });

  test("evaluating multiple facts", () => {
    expect(
      new AnnotationTruthTable()
        .add("P[a]", "P[b]", "P[c]")
        .evaluate("P[a]; P[b]")
    ).toBe(true);
  });

  test("assigning multiple facts", () => {
    let table = new AnnotationTruthTable().add("NOT [P[a]]; Q[a][b] ;\nL[cat]");
    expect(table.evaluate("Q[a][b]")).toBe(true);
    expect(table.evaluate("P[a]")).toBe(false);
    expect(table.evaluate("L[cat]")).toBe(true);
  });

  test("We can use the mod function to overwrite truth assignments", () => {
    expect(
      new AnnotationTruthTable()
        .add("p[a][b]")
        .mod("NOT [p[a][b]]")
        .evaluate("p[a][b]")
    ).toBe(false);
  });

  test("Finding mappings for a single sentence", () => {
    const myTable = new AnnotationTruthTable().add("p[a]", "p[b]", "q[c]");
    expect([...myTable.query("p[_x]")]).toStrictEqual([
      { _x: "a" },
      { _x: "b" },
    ]);
  });

  test("mapArguments", () => {
    let myTable = new AnnotationTruthTable()
      .add("p [a]", "q [_x]")
      .mapEntities({ _x: "b", a: "b" });

    expect(myTable.evaluate("p [a]")).toBeUndefined();
    expect(myTable.evaluate("q [_x]")).toBeUndefined();
    expect(myTable.evaluate("p [b]")).toBe(true);
    expect(myTable.evaluate("q [b]")).toBe(true);
  });
});
