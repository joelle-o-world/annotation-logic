import { isVariable } from "./variables";
import skipDuplicates from "../utils/skipDuplicates";
import {
  Contradiction,
  NotSupported as NotSupported,
  NotImplemented,
} from "../utils/Errors";
import deepCompare from "../deepCompare";
import {
  EntityMap,
  Fact,
  LogicImplementation,
  Sentence,
  Truth,
  VariableMap,
} from "./predicate-types";
import { getArgMapping, mapSentenceEntities } from "./mapping";
import { mergeMappings } from "../mappings";

function compareSentences(a: Sentence, b: Sentence) {
  return (
    a.predicate === b.predicate &&
    a.args.length === b.args.length &&
    a.args.every((arg, i) => b.args[i] === arg)
  );
}

export default class TruthTable implements LogicImplementation {
  private data: { sentence: Sentence; truth: true | false }[];

  constructor() {
    this.data = [];
  }

  evaluateSentence(sentence: Sentence) {
    let match = this.data.find((row) =>
      compareSentences(row.sentence, sentence)
    );
    if (match) return match.truth;
    else return undefined;
  }

  evaluateFacts(facts: Fact[]) {
    return facts.every((fact) => this.evaluateSentence(fact) === fact.truth);
  }

  /**
   * Finds index of the given sentence in the data store. Implementation specific
   */
  private findSentenceIndex(sentence: Sentence) {
    return this.data.findIndex((row) =>
      compareSentences(row.sentence, sentence)
    );
  }
  assign(sentence: Sentence, truth: Truth) {
    if (truth === undefined)
      throw new NotSupported("Cant assign truth value undefined");
    let index = this.findSentenceIndex(sentence);
    if (index !== -1 && this.data[index].truth !== truth)
      throw new Contradiction();
    else this.data.push({ sentence, truth });
  }
  reassign(sentence: Sentence, truth: true | false | undefined) {
    if (truth === undefined)
      throw new NotImplemented("Cant reassign truth value undefined");
    let index = this.findSentenceIndex(sentence);

    if (index !== -1) this.data[index] = { sentence, truth };
    else this.data.push({ sentence, truth });
    return this;
  }

  addFact(fact: Fact) {
    this.assign({ predicate: fact.predicate, args: fact.args }, fact.truth);
  }
  addFacts(facts: Fact[]) {
    for (let fact of facts) this.addFact(fact);
  }
  overwriteFact(fact: Fact): void {
    this.reassign({ predicate: fact.predicate, args: fact.args }, fact.truth);
  }
  overwriteFacts(facts: Fact[]): void {
    for (let fact of facts) this.overwriteFact(fact);
  }

  *iterateFacts() {
    for (let row of this.data) yield { ...row.sentence, truth: row.truth };
  }

  *iterateTrueSentences() {
    for (let row of this.data) if (row.truth === true) yield row.sentence;
  }

  *iterateFalseSentences() {
    for (let row of this.data) if (row.truth === false) yield row.sentence;
  }

  *iterateFactsByPredicate(predicate: string) {
    for (let fact of this.iterateFacts())
      if (fact.predicate === predicate) yield fact;
  }

  iterateVariables() {
    const facts = this.iterateFacts();
    return skipDuplicates(
      (function* () {
        for (let { args } of facts)
          for (let arg of args) if (isVariable(arg)) yield arg;
      })()
    );
  }
  iteratePredicates() {
    const facts = this.iterateFacts();
    return skipDuplicates(
      (function* () {
        for (let { predicate } of facts) yield predicate;
      })()
    );
  }

  iterateEntities() {
    const facts = this.iterateFacts();
    return skipDuplicates(
      (function* () {
        for (let { args } of facts) for (let arg of args) yield arg;
      })()
    );
  }

  mappingsFromFact(pattern: Fact) {
    const facts = this.iterateFactsByPredicate(pattern.predicate);
    return skipDuplicates(
      (function* () {
        for (let { args, truth } of facts) {
          if (truth !== pattern.truth) continue;
          let mapping = getArgMapping(pattern.args, args);
          if (mapping) yield mapping;
        }
      })(),
      deepCompare
    );
  }

  mappingsFromFacts(pattern: Fact[]): Iterable<VariableMap> {
    let accumulatedMappings = [{}];
    for (let fact of pattern) {
      let nextMappings = [];
      for (let a of this.mappingsFromFact(fact))
        for (let b of accumulatedMappings) {
          let merged = mergeMappings(a, b);
          if (merged) nextMappings.push(merged);
        }
      accumulatedMappings = nextMappings;
    }
    return accumulatedMappings;
  }

  mapEntities(mapping: EntityMap): TruthTable {
    const newTable = new TruthTable();

    for (let fact of this.iterateFacts()) {
      let newSentence = mapSentenceEntities(fact, mapping);
      newTable.assign(newSentence, fact.truth);
    }

    return newTable;
  }

  mapVariables(mapping: VariableMap): TruthTable {
    return this.mapEntities(mapping);
  }

  addRule() {
    // TruthTable will not support rules
    throw new NotSupported();
  }
}
