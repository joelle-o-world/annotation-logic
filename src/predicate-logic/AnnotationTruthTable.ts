import { getPredicate, isPredicate, un_nest } from "../args";
import ParsingTruthTable from "./ParsingTruthTable";
import { Fact, LabelledLogicObject, LogicInterface } from "./predicate-types";
import TruthTable from "./TruthTable";

const NOT = "NOT []";
const PASSIVE_RULE = "[] if []";

function parse(str: string): LabelledLogicObject {
  if (str === "true") return { kind: "Truth", object: true };
  if (str === "false") return { kind: "Truth", object: false };

  if (isPredicate(str)) return { kind: "Predicate", object: getPredicate(str) };

  const predicate = getPredicate(str);
  if (predicate === NOT) {
    const subArg = un_nest(str)[0];
    return {
      kind: "Fact",
      object: {
        truth: false,
        predicate: getPredicate(subArg),
        args: un_nest(subArg),
      },
    };
  }

  if (predicate === PASSIVE_RULE) {
    const [consequenceStr, conditionsStr] = un_nest(str);
    const conditions = conditionsStr
      // TODO: This should be a standardised part of annotation parsing library
      .split(/\s*;\s/)
      .map((conditionStr) => parseFact(conditionStr));

    return {
      kind: "Rule",
      object: {
        conditions,
        consequence: parseFact(consequenceStr),
      },
    };
  }

  return {
    kind: "Sentence",
    object: { predicate: getPredicate(str), args: un_nest(str) },
  };
}

function parseFact(str: string): Fact {
  const predicate = getPredicate(str);
  if (predicate === NOT) {
    const [nested] = un_nest(str);
    return {
      predicate: getPredicate(nested),
      args: un_nest(nested),
      truth: false,
    };
  } else
    return {
      predicate,
      args: un_nest(str),
      truth: true,
    };
}

export default class AnnotationTruthTable
  extends ParsingTruthTable
  implements LogicInterface
{
  constructor(table = new TruthTable()) {
    super(table, parse);
  }
}
