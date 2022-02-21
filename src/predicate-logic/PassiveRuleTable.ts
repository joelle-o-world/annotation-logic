import TruthTable from "./TruthTable";
import { getArgMapping } from "./variables";

type Assignment = {
  truth: true | false | undefined;
  sentence: { predicate: string; arguments: string[] };
};
interface PassiveRule {
  if: TruthTable;
  then: Assignment;
  // NOTE: Many to one relation ship
}

export default class PassiveRuleTable extends TruthTable {
  rules: PassiveRule[];

  private rulesWithPredicate(predicate: string) {
    return this.rules.filter(
      (rule) => rule.then.sentence.predicate === predicate
    );
  }

  evaluate(
    statement:
      | {
          predicate: string;
          arguments: string[];
        }
      | TruthTable
  ): true | false | undefined {
    let tableValue = super.evaluate(statement);
    if (
      tableValue === true ||
      tableValue === false ||
      statement instanceof TruthTable
    ) {
      return tableValue;
    } else {
      for (let rule of this.rulesWithPredicate(statement.predicate)) {
        let mapping = getArgMapping(
          rule.then.sentence.arguments,
          statement.arguments
        );
        let conditions = rule.if.mapArguments(mapping);
        // FIXME: This introduces a bug. These types of rules will only work in a binary truth system. must remove `undefined` as a truth value and make the default false
        if (this.evaluate(conditions) === true) return rule.then.truth;
        else continue;
      }

      // Otherwise,
      return undefined;
    }
  }
}
