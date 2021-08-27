import {
  un_nest,
  substitue_nested,
  wipe_nested,
  isShallow,
  assertShallow,
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
