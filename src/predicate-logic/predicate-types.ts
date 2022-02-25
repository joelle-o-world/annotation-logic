export type Predicate = string;
export type Entity = string;
export type Variable = `_${string}`;
export type Truth = true | false | undefined;
export type Sentence = { predicate: Predicate; args: Entity[] };
export type Fact = { predicate: Predicate; args: Entity[]; truth: Truth };
export type EntityMap = {
  [from: Entity]: Entity;
};
export type VariableMap = {
  [from: Variable]: Variable;
};
/**
 * A simple passive rule
 * if [conditions] then [consequence]
 *
 * These are passive and checked when evaluating the consequence
 */
export type Rule = {
  conditions: Fact[];
  consequence: Fact;
};

export type LabelledLogicObject =
  | { kind: "Predicate"; object: Predicate }
  | { kind: "Entity"; object: Entity }
  | { kind: "Variable"; object: Variable }
  | { kind: "Truth"; object: Truth }
  | { kind: "Sentence"; object: Sentence }
  | { kind: "Fact"; object: Fact }
  | { kind: "Facts"; object: Fact[] }
  | { kind: "Rule"; object: Rule };

export interface LogicInterface {
  add(...stuff: string[]): this;
  mod(...stuff: string[]): this;

  evaluate(something: string): Truth;

  query(pattern: string): Iterable<VariableMap>;

  mapEntities(mapping: EntityMap): typeof this;
}

export interface LogicImplementation {
  assign(sentence: Sentence, truth: Truth): void;
  /**
   * Same as assign but does not throw exception for contradictions
   */
  reassign(sentence: Sentence, truth: Truth): void;
  addFact(fact: Fact): void;
  addFacts(facts: Fact[]): void;
  overwriteFact(fact: Fact): void;
  overwriteFacts(facts: Fact[]): void;

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
  mappingsFromFact(pattern: Fact): Iterable<VariableMap>;
  mappingsFromFacts(pattern: Fact[]): Iterable<VariableMap>;

  // Rules
  addRule(rule: Rule): void;
}

// TODO: Responses: when [] then []
// TODO: Actions
// TODO: Permissions / possibilities: if [] then it is possible that []
// TODO: Generative logics
