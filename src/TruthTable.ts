import { EvaluatesSentences, AssignsTruthValues } from "./logical-interfaces";

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
  implements EvaluatesSentences<Sentence>, AssignsTruthValues<Sentence>
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

  false(...sentence: Sentence[]) {
    for (let sentence of sentences) this.assign(sentence, false);
    return this;
  }
}