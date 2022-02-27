import { getPredicate, isPredicate, listClauses, un_nest } from "../args";
import ParsingTruthTable from "./ParsingTruthTable";
import { Fact, LabelledLogicObject, LogicInterface } from "./predicate-types";
import RuleTable from "./RuleTable";
import TruthTable from "./TruthTable";

const NOT = "NOT []";
const PASSIVE_RULE = "if [] then []";

function parse(str: string): LabelledLogicObject {
  if (str === "true") return { kind: "Truth", object: true };
  if (str === "false") return { kind: "Truth", object: false };

  const clauses = listClauses(str);
  if (clauses.length > 1)
    return {
      kind: "Facts",
      object: clauses.map((clause) => parseFact(clause)),
    };

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
    const [conditionsStr, consequenceStr] = un_nest(str);
    const conditions = listClauses(conditionsStr)
      // TODO: This should be a standardised part of annotation parsing library
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
  constructor(table = new RuleTable()) {
    super(table, (str) => {
      const parsed = parse(str);
      //console.log(str, "->", parsed.kind + ":", parsed.object);
      return parsed;
    });
  }
}
