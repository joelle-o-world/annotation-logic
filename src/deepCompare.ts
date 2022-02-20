export default function deepCompare(a: any, b: any) {
  if (a && b && typeof a === "object" && typeof b === "object")
    return [...Object.keys(a), ...Object.keys(b)].every((key) =>
      deepCompare(a[key], b[key])
    );
  else return a === b;
}
