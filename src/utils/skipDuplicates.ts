export default function* skipDuplicates<T>(
  iterator: Iterable<T>,
  compare = (a: T, b: T) => a === b
): Iterable<T> {
  let yielded = [];
  for (let a of iterator) {
    if (yielded.every((b) => !compare(a, b))) yield a;
  }
}
