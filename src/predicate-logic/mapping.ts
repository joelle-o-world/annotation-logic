import { EntityMap, Sentence, VariableMap } from "./predicate-types";
import { isVariable } from "./variables";

export function mapSentenceEntities(
  { predicate, args }: Sentence,
  mapping: EntityMap
) {
  return {
    predicate,
    args: args.map((arg) => mapping[arg] || arg),
  };
}

export function mapSentenceVariables(sentence: Sentence, mapping: VariableMap) {
  return mapSentenceEntities(sentence, mapping);
}

export function getArgMapping(from: string[], onto: string[]): VariableMap {
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

  if (Object.keys(mapping).length === 0) return null;

  // Otherwise
  return mapping;
}

export function getSentenceVariableMapping(
  from: Sentence,
  onto: Sentence
): VariableMap {
  if (from.predicate !== onto.predicate) return null;
  let mapping = getArgMapping(from.args, onto.args);
  if (mapping) return mapping;
  else return null;
}
