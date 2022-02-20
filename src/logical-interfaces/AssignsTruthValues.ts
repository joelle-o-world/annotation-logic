/**
 * An interface for assigning `true' or `false` to specific statements.
 */
export default interface AssignsTruthValues<Sentence = string> {
  /**
   * Set the truth value of the given statements to `true'
   */
  true(...statements: Sentence[]): this;

  /**
   * Set the truth value of the given statements to `false`
   */
  false(...statements: Sentence[]): this;
}
