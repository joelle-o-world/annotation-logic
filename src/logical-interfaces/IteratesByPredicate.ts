export default interface IteratesByPredicate<Sentence = string> {
  iterateByPredicate(predicate: string): Iterator<Sentence>;
}
