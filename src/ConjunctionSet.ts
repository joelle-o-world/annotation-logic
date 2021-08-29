import { compare } from "./args";

export default class ConjunctionSet implements LogicStructure {
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

  checkForInternalContradictions(): this {
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

  checkForContradictionsWith(set: ConjunctionSet): void {
    for (let { statement, truth } of this.iterateTruthAssigments()) {
      if (truth === undefined) continue;
      let evaluation = set.evaluate(statement);
      if (evaluation === truth || evaluation === undefined) continue;
      else throw `Found contradiction: ${JSON.stringify(statement)}`;
    }
  }
}
