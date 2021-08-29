import { compare } from "./args";

export default class ConjunctionSet implements LogicStructure {
  private trueStatements: string[];
  private falseStatements: string[];

  constructor(trueStatements: string[], falseStatements: string[]) {
    for (let statement of trueStatements) this.true(statement);
    for (let statement of falseStatements) this.false(statement);
  }

  /**
   * Add a 'true' statement to the set.
   */
  true(...statements: string[]) {
    for (let statement of statements) this.trueStatements.push(statement);
  }

  /**
   * Add a 'false' statement to the set.
   */
  false(...statements: string[]) {
    for (let statement of statements) this.falseStatements.push(statement);
  }

  evaluate(x: string): true | false | undefined {
    if (this.falseStatements.some((y) => compare(x, y))) return false;
    else if (this.trueStatements.some((y) => compare(x, y))) return true;
    else return undefined;
  }

  checkForInternalContradictions() {
    for (let x of this.trueStatements)
      for (let y of this.falseStatements)
        if (compare(x, y))
          throw `Found contradiction between ${JSON.stringify(
            x
          )} (true) and ${JSON.stringify(y)} (false)`;
  }
}
