import {
  un_nest,
  substitue_nested,
  wipe_nested,
  isShallow,
  assertShallow,
  standardForm,
  getOneWordPredicate,
  logicNotation,
  getAssignment,
  compare,
} from "./args";

test("un_nest", () => {
  expect(
    un_nest("[the cat =a] is eating [[the dog =b]'s dinner =c]")
  ).toStrictEqual(["the cat =a", "[the dog =b]'s dinner =c"]);
});

test("substitue_nested", () => {
  expect(
    substitue_nested("[the cat] is eating [[the dog]'s dinner]", [
      "the mouse",
      "some delicious cheese",
    ])
  ).toBe("[the mouse] is eating [some delicious cheese]");
  expect(substitue_nested("[] naps", ["the cat"])).toBe("[the cat] naps");
});

test("wipe_nested", () => {
  expect(wipe_nested("[the cat] naps")).toBe("[] naps");
});

test("isShallow", () => {
  expect(isShallow("[the cat] naps")).toBe(true);
  expect(isShallow("the cat")).toBe(true);
  expect(isShallow("[the cat] is eating [[the dog]'s dinner]")).toBe(false);
});

test("assertShallow", () => {
  expect(assertShallow("[the cat] naps")).toBe(true);
  expect(assertShallow("the cat")).toBe(true);
  expect(() =>
    assertShallow("[the cat] is eating [[the dog]'s dinner]")
  ).toThrow();
});

describe.skip("standardForm", () => {
  test.each([
    ["the cat", "the cat"],
    ["[the cat =cat] did [a terrible poo =poo]", "[=cat] did [=poo]"],
  ])("%j --standardised--> %j", (input, expectedOutput) => {
    expect(standardForm(input)).toBe(expectedOutput);
  });
});

test.todo("deepParse");

test.todo("getPredicate");
describe.skip("one word predicates", () => {
  describe("getOneWordPredicate", () => {
    test.each([
      ["the cat", "TheCat"],
      ["this is [my friend]", "ThisIs_"],
    ])("getOneWordPredicate(%j) = %j", (input, expectedOutput) => {
      expect(getOneWordPredicate(input)).toBe(expectedOutput);
    });
  });

  test.todo("isOneWordPredicate");
  test.todo("assertOneWordPredicate");
  describe("logicNotation", () => {
    test.each([["[=cat] sat on [=mat]", "_SatOn_(cat, mat)"]])(
      "logicNotation(%j) = %j",
      (input, expectedOutput) => {
        expect(logicNotation(input)).toBe(expectedOutput);
      }
    );
  });
});
test.todo("iterateBits");

describe("assignments", () => {
  test("getAssignment", () => {
    expect(getAssignment("the cat =cat")).toBe("cat");
    expect(() => getAssignment("the cat")).toThrow();
    expect(() => getAssignment("[=a] and [=b]")).toThrow();
    expect(getAssignment("[=a] and [=b] =c")).toBe("c");
    expect(() => getAssignment("=a =b")).toThrow();
  });
  test.todo("getAssignments");
  test.todo("getFirstAssignment");
  test.todo("setAssignment");
});

test("compare()", () => {
  expect(compare("[=a] is on [=b]", "[=a] is on [=b]")).toBe(true);
  expect(compare("[the lamp =a] is on [the desk=b]", "[=a] is on [=b]")).toBe(
    true
  );
  expect(compare("[=a] is on [=b]", "[=c] is on [=b]")).toBe(false);
});
