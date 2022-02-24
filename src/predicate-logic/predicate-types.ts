type Predicate = string;
type Entity = string;
type Variable = `_${string}`;
type Truth = true | false | undefined;
type Sentence = { predicate: Predicate; args: Entity[] };
type Fact = { predicate: Predicate; args: Entity[]; truth: Truth };
type ArgMap = {
  [from: Entity]: Entity;
};
type VariableMap = {
  [from: Variable]: Variable;
};
/**
 * A simple passive rule
 * if [conditions] then [consequence]
 *
 * These are passive and checked when evaluating the consequence
 */
type Rule = {
  conditions: Fact[];
  consequence: Fact;
};

interface LogicInterface {
  add(
    /**
     * Could be a rule, a fact or factset
     */
    something: string
  ): void;

  evaluate(something: string): Truth;

  query(pattern: string): Generator<{ mapping: VariableMap; add(): void }>;
}

interface LogicImplementation {
  assign(sentence: Sentence, truth: Truth): void;
  /**
   * Same as assign but does not throw exception for contradictions
   */
  reassign(sentence: Sentence, truth: Truth): void;

  evaluate(sentence: Sentence): Truth;
  listEntities(): Entity[];
  listVariables(): Variable[];
  listPredicates(): Predicate[];
  listFactsByPredicate(predicate: Predicate): Fact[];

  // Rules
  addRule(rule: Rule): void;
}

// TODO: Responses: when [] then []
// TODO: Actions
// TODO: Permissions / possibilities: if [] then it is possible that []
// TODO: Generative logics
