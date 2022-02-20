import deepCompare from "../deepCompare";
import { Variable } from "../predicate-logic/variables";

export default interface VariableMapping {
  [variable: Variable]: string;
}

export function compareVariableMappings(
  a: VariableMapping,
  b: VariableMapping
) {
  return deepCompare(a, b);
}
