import { mappingsAreCompatible, mergeMappings } from "./mappings";

describe("VariableMappings", () => {
  test.each([
    [
      { x: "a" },
      { y: "b" },
      {
        x: "a",
        y: "b",
      },
    ],
    [{ x: "a" }, { x: "b" }, null],
    [{ x: "a" }, { x: "a" }, { x: "a" }],
    [
      { x: "a" },
      { y: "b", x: "a" },
      {
        x: "a",
        y: "b",
      },
    ],
  ])("mappings %o merged with %o = %o", (a, b, c) => {
    expect(mergeMappings(a, b)).toStrictEqual(c);
  });

  test.each([
    [{ x: "a" }, {}],
    [{ x: "a" }, { y: "a" }],
    [{ x: "a" }, { y: "b" }],
    [{ x: "a" }, { x: "a", y: "b" }],
  ])("Mappings %o and %o are compatible", (a, b) => {
    expect(mappingsAreCompatible(a, b)).toBe(true);
  });
  test.each([[{ x: "a" }, { x: "b" }]])(
    "Mappings %o and %o are not compatible",
    (a, b) => {
      expect(mappingsAreCompatible(a, b)).toBe(false);
    }
  );

  test.todo("arrayIncludesMapping");
  test.todo("compareMappings");
});
