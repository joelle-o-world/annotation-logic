import { getPredicate, hasNestedArguments, un_nest } from "../args";
import { NotImplemented } from "../utils/Errors";
import ParsingTruthTable from "./ParsingTruthTable";
import { LabelledLogicObject, LogicInterface } from "./predicate-types";
import TruthTable from "./TruthTable";

const NOT = "NOT []";

function parse(str: string): LabelledLogicObject {
  if (str === "true") return { kind: "Truth", object: true };
  if (str === "false") return { kind: "Truth", object: false };

  if (!hasNestedArguments(str))
    return { kind: "Predicate", object: getPredicate(str) };

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

  return {
    kind: "Sentence",
    object: { predicate: getPredicate(str), args: un_nest(str) },
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
