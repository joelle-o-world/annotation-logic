type Predicate = string;
type Entity = string;
type Variable = `_${string}`;
type Truth = true | false | undefined;
type Sentence = { predicate: Predicate; args: Entity[] };
type Fact = { predicate: Predicate; args: Entity[]; truth: Truth };
type EntityMap = {
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

  query(pattern: string): Iterable<{ mapping: VariableMap; add(): void }>;
}

interface LogicImplementation {
  assign(sentence: Sentence, truth: Truth): void;
  /**
   * Same as assign but does not throw exception for contradictions
   */
  reassign(sentence: Sentence, truth: Truth): void;

  evaluateSentence(sentence: Sentence): Truth;
  evaluateFacts(facts: Fact[]): Truth;

  // Iterating
  iterateEntities(): Iterable<Entity>;
  iterateVariables(): Iterable<Variable>;
  iteratePredicates(): Iterable<Predicate>;
  iterateFacts(): Iterable<Fact>;
  iterateFactsByPredicate(predicate: Predicate): Iterable<Fact>;
  iterateFalseSentences(): Iterable<Sentence>;
  iterateTrueSentences(): Iterable<Sentence>;

  // Mapping arguments
  mapEntities(mapping: EntityMap): typeof this;
  mapVariables(mapping: VariableMap): typeof this;

  // Finding Mappings
  fitFact(pattern: Fact): Iterable<VariableMap>;
  fitFacts(pattern: Fact[]): Iterable<VariableMap>;

  // Rules
  addRule(rule: Rule): void;
}

// TODO: Responses: when [] then []
// TODO: Actions
// TODO: Permissions / possibilities: if [] then it is possible that []
// TODO: Generative logics
