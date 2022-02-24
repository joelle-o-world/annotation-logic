import { getArgMapping, isVariable } from "./variables";
import {
  EvaluatesSentences,
  AssignsTruthValues,
  IteratesTruthAssignments,
} from "../logical-interfaces";
import skipDuplicates from "../utils/skipDuplicates";
import {
  Contradiction,
  MethodNotSupported as NotSupported,
  NotImplemented,
} from "../utils/Errors";
import deepCompare from "../deepCompare";

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

  mapVariables(mapping: VariableMap): this {
    throw new NotImplemented();
  }

  evaluateSentence(sentence: Sentence) {
    let match = this.data.find((row) =>
      compareSentences(row.sentence, sentence)
    );
    if (match) return match.truth;
    else return undefined;
  }

  evaluateFacts(facts: Fact[]) {
    // TODO: Add warning/error for subclasses of TruthTable

    for (let fact of facts)
      if (this.evaluateSentence(fact) !== fact.truth) return false;
    // Otherwise
    return true;
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
    let index = this.findSentenceIndex(sentence);
    if (index !== -1 && this.data[index].truth !== truth)
      throw new Contradiction();
    else this.data.push({ sentence, truth });
  }
  reassign(sentence: Sentence, truth: true | false | undefined) {
    let index = this.findSentenceIndex(sentence);

    if (index !== -1) this.data.splice(index, 1);
    if (truth !== undefined) this.data.push({ sentence, truth });
    return this;
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
    return skipDuplicates(
      (function* () {
        for (let { args } of this.iterateFacts())
          for (let arg of args) if (isVariable(arg)) yield arg;
      })()
    );
  }
  iteratePredicates() {
    return skipDuplicates(
      (function* () {
        for (let predicate of this.iterateFacts) yield predicate;
      })()
    );
  }

  iterateEntities() {
    return skipDuplicates(
      (function* () {
        for (let { args } of this.iterateFacts())
          for (let arg of args) yield arg;
      })()
    );
  }

  mappingsFromFact(pattern: Fact) {
    return skipDuplicates(
      (function* () {
        for (let { args, truth } of this.iterateFactsByPredicate(
          pattern.predicate
        )) {
          let mapping = getArgMapping(pattern.args, args);
          if (mapping) yield mapping;
        }
      })(),
      deepCompare
    );
  }

  mappingsFromFacts(pattern: Fact[]): Iterable<VariableMap> {
    throw new NotImplemented();
  }

  mapEntities(mapping: EntityMap): TruthTable {
    const newTable = new TruthTable();

    for (let assignment of this.iterateFacts()) {
      let newSentence = {
        predicate: assignment.predicate,
        args: assignment.args.map((arg) => mapping[arg] || arg),
      };
      if (newTable.evaluateSentence(newSentence) === !assignment.truth)
        throw new Error(
          `Contradiction during mapping: ${JSON.stringify(newSentence)}`
        );
      newTable.assign(newSentence, assignment.truth);
    }

    return newTable;
  }

  addRule() {
    throw new NotSupported();
  }
}
