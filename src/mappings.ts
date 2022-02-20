import { VariableMapping } from "./logical-interfaces";

export function mergeMappings(
  a: VariableMapping,
  b: VariableMapping
): VariableMapping | null {
  // TODO: allow unlimited arguments
  if (mappingsAreCompatible(a, b))
    return {
      ...a,
      ...b,
    };
  else return null;
}

export function mappingsAreCompatible(
  a: VariableMapping,
  b: VariableMapping
): boolean {
  // TODO: allow unlimited arguments
  for (let key in a)
    if (b[key] !== undefined && b[key] !== a[key]) return false;
  // Otherwise
  return true;
}

export function arrayIncludesMapping(
  arr: VariableMapping[],
  mapping: VariableMapping
): boolean {
  return arr.some((x) => compareMappings(x, mapping));
}

export function compareMappings(
  a: VariableMapping,
  b: VariableMapping
): boolean {
  // TODO: allow unlimited arguments
  let aKeys = Object.keys(a);
  let bKeys = Object.keys(b);
  return (
    aKeys.length === bKeys.length && aKeys.every((key) => a[key] === b[key])
  );
}
