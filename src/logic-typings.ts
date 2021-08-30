export interface VariableMapping {
  [variable: string]: string;
}
/**
 * An interface for assigning `true' or `false` to specific statements.
 */
export interface AssignsTruthValues {
  /**
   * Set the truth value of the given statements to `true'
   */
  true(...statements: string[]): this;

  /**
   * Set the truth value of the given statements to `false`
   */
  false(...statements: string[]): this;
}
export interface IteratesTruthAssignments {
  iterateTruthAssigments(): Iterator<{
    truth: true | false | undefined;
    statement: string;
  }>;

  iterateTrueStatements(): Iterator<string>;
  iterateFalseStatements(): Iterator<string>;
  iterateStatements(truthValue: boolean): Iterator<string>;
}

export interface IteratesByPredicate {
  iterateByPredicate(): Iterator<string>;
}

export interface Evaluates<T> {
  evaluate(statement: T): true | false | undefined;
}

export interface EvaluatesStatements extends Evaluates<string> {}

export interface FindsMappings<T> {
  getMappings(
    variables: string[],
    from: T,
    truth?: true | false
  ): Iterator<{ [variable: string]: string }>;
}
