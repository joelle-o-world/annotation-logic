import AnnotationTruthTable from "./AnnotationTruthTable";

describe.skip("AnnotationTruthTable", () => {
  test.todo("We can assign some truth values then look them up", () => {
    expect(new AnnotationTruthTable().true("P(a,b)").evaluate("P(a,b)")).toBe(
      true
    );
    expect(
      new AnnotationTruthTable()
        .true("p[a][b]")
        .false("p[a][b]")
        .evaluate("p[a][b]")
    ).toBe(false);
  });

  test.todo("Finding mappings for a single sentence", () => {
    const myTable = new AnnotationTruthTable().true("p[a]", "p[b]", "q[c]");
    expect([...myTable.findMappings("p[_x]")]).toStrictEqual([
      { _x: "a" },
      { _x: "b" },
    ]);
  });

  test.todo("mapArguments", () => {
    let myTable = new AnnotationTruthTable()
      .true("p [a]", "q [_x]")
      .mapArguments({ _x: "b", a: "b" });

    expect(myTable.evaluate("p [a]")).toBeUndefined();
    expect(myTable.evaluate("q [_x]")).toBeUndefined();
    expect(myTable.evaluate("p [b]")).toBe(true);
    expect(myTable.evaluate("q [b]")).toBe(true);
  });
});
