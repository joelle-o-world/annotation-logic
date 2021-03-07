import {un_nest, substitue_nested, wipe_nested} from "./args";

expect(
  un_nest("[the cat =a ] is eating [[the dog =b]'s dinner =c")
).toStrictEqual([
  "the cat =a",
  "[the dog =b]'s dinner =c"
])

expect(
  substitue_nested(
    "[the cat] is eating [[the dog]'s dinner]",
    ["the mouse", "some delicious cheese"]
  )
).toBe("[the mouse] is eating [some delicious cheese]")

expect(
  substitue_nested( "[] naps", ["the cat"] )
).toBe("[the cat] naps")

expect(
  wipe_nested("[the cat] naps")
).toBe("[] naps")
