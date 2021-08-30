import {
  AssignsTruthValues,
  Evaluates,
  IteratesTruthAssignments,
  FindsMappings,
  VariableMapping,
} from "./logic-typings";
import { compare, getMapping } from "./args";
import {
  arrayIncludesMapping,
  compareMappings,
  mergeMappings,
} from "./mappings";

export default class ConjunctionSet
  implements
    AssignsTruthValues,
    Evaluates<string>,
    IteratesTruthAssignments,
    FindsMappings<string>,
    FindsMappings<ConjunctionSet>
{
  private trueStatements: string[];
  private falseStatements: string[];

  constructor() {
    this.trueStatements = [];
    this.falseStatements = [];
  }

  /**
   * Add a 'true' statement to the set.
   */
  true(...statements: string[]): this {
    for (let statement of statements) this.trueStatements.push(statement);
    return this;
  }

  /**
   * Add a 'false' statement to the set.
   */
  false(...statements: string[]): this {
    for (let statement of statements) this.falseStatements.push(statement);
    return this;
  }

  evaluate(x: string): true | false | undefined {
    if (this.falseStatements.some((y) => compare(x, y))) return false;
    else if (this.trueStatements.some((y) => compare(x, y))) return true;
    else return undefined;
  }

  healthCheck(): this {
    this.checkForInternalContradictions();
    // TODO: Check for dulicates
    return this;
  }
  private checkForInternalContradictions(): this {
    for (let x of this.trueStatements)
      for (let y of this.falseStatements)
        if (compare(x, y))
          throw `Found contradiction between ${JSON.stringify(
            x
          )} (true) and ${JSON.stringify(y)} (false)`;

    return this;
  }

  *iterateTruthAssigments() {
    for (let statement of this.trueStatements) yield { truth: true, statement };
    for (let statement of this.falseStatements)
      yield { truth: false, statement };
  }

  *iterateTrueStatements() {
    for (let statement of this.trueStatements) yield statement;
  }
  *iterateFalseStatements() {
    for (let statement of this.falseStatements) yield statement;
  }
  *iterateStatements(truth: boolean) {
    for (let statement of truth
      ? this.iterateTrueStatements()
      : this.iterateFalseStatements())
      yield statement;
  }

  checkForContradictionsWith(set: ConjunctionSet): void {
    for (let { statement, truth } of this.iterateTruthAssigments()) {
      if (truth === undefined) continue;
      let evaluation = set.evaluate(statement);
      if (evaluation === truth || evaluation === undefined) continue;
      else throw `Found contradiction: ${JSON.stringify(statement)}`;
    }
  }

  mapAssignments(mapping: VariableMapping) {
    // TODO
  }

  private *findMappingsFromSingleStatement(
    variables: string[],
    from: string,
    truth: true | false = true
  ) {
    for (let statement of this.iterateStatements(truth)) {
      let mapping = getMapping(variables, from, statement);
      if (mapping) yield mapping;
      //let hypothesis = deepMapAssignments(mapping, from);
    }

    // TODO: Think through possible contradiction outcomes
  }

  private *findMappingsFromConjunctionSet(
    variables: string[],
    from: ConjunctionSet,
    truth: true | false = true
  ): Generator<VariableMapping> {
    const mappings = [];
    let yieldCursor = 0;
    const yieldMapping = (m: VariableMapping) => {
      // Exit early if mapping exists
      if (arrayIncludesMapping(mappings, m)) return;
      mappings.push(m);

      // TODO: ignore mapping if it leads to interal contradictions in mapping set
      // TODO: ignore mapping if it leads to contradictions between mapping set and this set.

      for (let n of mappings) {
        let merged = mergeMappings(m, n);
        if (
          merged &&
          !compareMappings(merged, m) &&
          !compareMappings(merged, n)
        )
          yieldMapping(merged);
      }
    };

    for (let statement of from.iterateStatements(truth)) {
      for (let m of this.findMappingsFromSingleStatement(
        variables,
        statement,
        truth
      )) {
        if (m) yieldMapping(m);
        while (yieldCursor < mappings.length) yield mappings[yieldCursor++];
      }
    }
    while (yieldCursor < mappings.length) yield mappings[yieldCursor++];
  }

  findMappings(
    variables: string[],
    from: string | ConjunctionSet,
    truth: true | false = true
  ) {
    if (typeof from === "string")
      return this.findMappingsFromSingleStatement(variables, from, truth);
    else if (from instanceof ConjunctionSet)
      return this.findMappingsFromConjunctionSet(variables, from, truth);
  }
}
