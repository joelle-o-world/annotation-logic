/**
 * An interface iterating statements with `true`/`false` truth values
 */
export default interface IteratesTruthAssignments<Sentence = string> {
  /**
   * Iterate through all truth assignments in the structure
   */
  iterateTruthAssignments(): Iterator<{
    truth: true | false | undefined;
    statement: Sentence;
  }>;

  /**
   * Iterate through all statements assigned `true`.
   */
  iterateTrueStatements(): Iterator<Sentence>;

  /**
   * Iterate through all statements assigned `false`
   */
  iterateFalseStatements(): Iterator<Sentence>;

  /**
   * Iterate all statements in the structure, without their assigned truth values.
   */
  iterateStatements(truthValue: boolean): Iterator<Sentence>;
}
