import { isVariable } from "./variables";
import {
  EvaluatesSentences,
  AssignsTruthValues,
  IteratesTruthAssignments,
} from "../logical-interfaces";
import VariableMapping, {
  compareVariableMappings,
} from "../logical-interfaces/VariableMapping";

interface Sentence {
  predicate: string;
  arguments: string[];
}
function compareSentences(a: Sentence, b: Sentence) {
  return (
    a.predicate === b.predicate &&
    a.arguments.length === b.arguments.length &&
    a.arguments.every((arg, i) => b.arguments[i] === arg)
  );
}

export default class TruthTable
  implements
    EvaluatesSentences<Sentence>,
    AssignsTruthValues<Sentence>,
    IteratesTruthAssignments<Sentence>
{
  private data: { sentence: Sentence; truth: true | false }[];

  constructor() {
    this.data = [];
  }

  evaluate(statement: Sentence) {
    let match = this.data.find((row) =>
      compareSentences(row.sentence, statement)
    );
    if (match) return match.truth;
    else return undefined;
  }

  assign(sentence: Sentence, truth: true | false | undefined) {
    let index = this.data.findIndex((row) =>
      compareSentences(row.sentence, sentence)
    );

    if (index !== -1) this.data.splice(index, 1);
    if (truth !== undefined) this.data.push({ sentence, truth });
    return this;
  }

  true(...sentences: Sentence[]) {
    for (let sentence of sentences) this.assign(sentence, true);
    return this;
  }

  false(...sentences: Sentence[]) {
    for (let sentence of sentences) this.assign(sentence, false);
    return this;
  }

  *iterateTruthAssignments() {
    for (let row of this.data)
      yield { statement: row.sentence, truth: row.truth };
  }

  *iterateTrueStatements() {
    for (let row of this.data) if (row.truth === true) yield row.sentence;
  }

  *iterateFalseStatements() {
    for (let row of this.data) if (row.truth === false) yield row.sentence;
  }

  *iterateStatements() {
    for (let row of this.data) yield row.sentence;
  }

  *iterateByPredicate(predicate: string) {
    for (let row of this.data)
      if (row.sentence.predicate === predicate)
        yield { statement: row.sentence, truth: row.truth };
  }

  private static getSentenceMapping(
    patternSentence: Sentence,
    sentence: Sentence
  ): VariableMapping | null {
    let mapping = {};
    for (let i in sentence.arguments) {
      if (
        isVariable(patternSentence.arguments[i]) &&
        (!mapping[patternSentence.arguments[i]] ||
          mapping[patternSentence.arguments[i]] === sentence.arguments[i])
      )
        mapping[patternSentence.arguments[i]] = sentence.arguments[i];
      else if (patternSentence.arguments[i] === sentence.arguments[i]) continue;
      else return null;
    }
    // Otherwise
    return mapping;
  }

  *findMappings(pattern: { statement: Sentence; truth: true | false }) {
    const yieldedMappings: VariableMapping[] = [];
    for (let { statement, truth } of this.iterateByPredicate(
      pattern.statement.predicate
    )) {
      if (truth === pattern.truth) {
        let mapping = TruthTable.getSentenceMapping(
          pattern.statement,
          statement
        );
        if (
          mapping &&
          !yieldedMappings.some((m) => compareVariableMappings(m, mapping))
        )
          yield mapping;
      }
    }
  }

  mapArguments(mapping: { [oldName: string]: string }): TruthTable {
    const newTable = new TruthTable();

    for (let assignment of this.iterateTruthAssignments()) {
      let newStatement = {
        predicate: assignment.statement.predicate,
        arguments: assignment.statement.arguments.map(
          (arg) => mapping[arg] || arg
        ),
      };
      if (newTable.evaluate(newStatement) === !assignment.truth)
        throw new Error(
          `Contradiction during mapping: ${JSON.stringify(newStatement)}`
        );
      newTable.assign(newStatement, assignment.truth);
    }

    return newTable;
  }
}
