import { Contradiction, NotImplemented } from "../utils/Errors";
import skipDuplicates from "../utils/skipDuplicates";
import AnnotationTruthTable from "./AnnotationTruthTable";
import { getSentenceVariableMapping, mapSentenceVariables } from "./mapping";
import {
  EntityMap,
  Fact,
  LogicImplementation,
  Rule,
  Sentence,
  Truth,
  VariableMap,
} from "./predicate-types";
import TruthTable from "./TruthTable";
import { isVariable } from "./variables";

export default class RuleTable implements LogicImplementation {
  private base: LogicImplementation;
  private rules: Rule[];

  constructor(
    given: LogicImplementation = new TruthTable(),
    rules: Rule[] = []
  ) {
    this.base = given;
    this.rules = rules;
  }

  assign(sentence: Sentence, truth: Truth): void {
    if (this.evaluateSentence(sentence) === !truth) throw new Contradiction();
    this.base.assign(sentence, truth);
  }

  reassign(sentence: Sentence, truth: Truth): void {
    this.base.reassign(sentence, truth);
  }

  addFact(fact: Fact): void {
    // Check for contradiction using rules
    if (this.evaluateSentence(fact) === !fact.truth) throw new Contradiction();
    this.base.addFact(fact);
  }

  addFacts(facts: Fact[]): void {
    for (let fact of facts) this.addFact(fact);
  }

  overwriteFact(fact: Fact): void {
    // NOTE: Facts in the base table take priority over the evaluation of rules, so this is still an overwrite operation
    this.base.overwriteFact(fact);
  }
  overwriteFacts(facts: Fact[]): void {
    for (let fact of facts) this.overwriteFact(fact);
  }
  evaluateSentence(sentence: Sentence): Truth {
    let accordingToBase = this.base.evaluateSentence(sentence);
    if (accordingToBase !== undefined) return accordingToBase;
    else {
      let rule = this.rules
        .filter((rule) => rule.consequence.predicate === sentence.predicate)
        .find((rule) =>
          rule.conditions.every((condition) => {
            const mapping = getSentenceVariableMapping(
              rule.consequence,
              sentence
            );
            const mappedCondition = mapSentenceVariables(
              condition,
              getSentenceVariableMapping(rule.consequence, sentence)
            );

            return this.evaluateSentence(mappedCondition) == condition.truth;
          })
        );
      if (rule) return rule.consequence.truth;
      // TODO: But what if a rule later in the list makes a contradiction!
    }

    // TODO: Map and evaluate each condition
  }

  evaluateFacts(facts: Fact[]) {
    return facts.every((fact) => this.evaluateSentence(fact) === fact.truth);
  }

  iterateEntities(): Iterable<string> {
    throw new NotImplemented();
  }
  iterateVariables(): Iterable<`_${string}`> {
    throw new NotImplemented();
  }
  iteratePredicates(): Iterable<string> {
    throw new NotImplemented();
  }
  iterateFacts(): Iterable<Fact> {
    throw new NotImplemented();
  }
  iterateFactsByPredicate(predicate: string): Iterable<Fact> {
    throw new NotImplemented();
  }
  iterateFalseSentences(): Iterable<Sentence> {
    throw new NotImplemented();
  }
  iterateTrueSentences(): Iterable<Sentence> {
    throw new NotImplemented();
  }
  mapEntities(mapping: EntityMap) {
    // TODO: Map the rules too?
    return new RuleTable(this.base.mapEntities(mapping), this.rules);
  }
  mapVariables(mapping: VariableMap) {
    throw new NotImplemented();
  }
  mappingsFromFact(pattern: Fact): Iterable<VariableMap> {
    const baseMappings = this.base.mappingsFromFact(pattern);
    const relevantRules = this.rules.filter(
      (rule) =>
        rule.consequence.predicate === pattern.predicate &&
        rule.consequence.truth === pattern.truth &&
        rule.consequence.args.every(
          (arg, i) => isVariable(arg) || arg === pattern.args[i]
        )
    );
    return skipDuplicates(
      (function* () {
        for (let mapping of baseMappings) yield mapping;
        for (let rule of relevantRules) {
          // TODO: Maybe remove the irrelevent variables
          for (let mapping of this.findMappingsFromFacts(rule.conditions))
            yield mapping;
        }
        // TODO: Find the mappings from rule consequences
      })()
    );
  }
  mappingsFromFacts(pattern: Fact[]): Iterable<VariableMap> {
    throw new NotImplemented();
  }
  addRule(rule: Rule): void {
    // TODO: Check for resultant contradictions?
    this.rules.push(rule);
  }
}
