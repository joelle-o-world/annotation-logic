import type { VariableMapping } from "../logical-interfaces";

export function isVariable(arg: string): arg is Variable {
  // Anything beginning with an underscore
  return /^_/.test(arg);
}

export function getArgMapping(from: string[], onto: string[]): VariableMapping {
  if (from.length !== onto.length)
    throw new Error("different numbers of arguments");

  let mapping = {};
  for (let i in from) {
    if (
      isVariable(from[i]) &&
      (!mapping[from[i]] || mapping[from[i]] === onto[i])
    )
      mapping[from[i]] = onto[i];
    else if (from[i] === onto[i]) continue;
    else return null;
  }
  // Otherwise
  return mapping;
}
