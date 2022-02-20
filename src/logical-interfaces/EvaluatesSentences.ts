export default interface EvaluatesSentences<Sentence = string> {
  evaluate(statement: Sentence): true | false | undefined;
}
