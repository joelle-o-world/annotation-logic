import { getPredicate, un_nest } from "../args";
import TruthTable from "./TruthTable";

export default class AnnotationTruthTable {
  private table: TruthTable;
  private static parse(str: string) {
    return {
      predicate: getPredicate(str),
      arguments: un_nest(str),
    };
  }

  constructor(table = new TruthTable()) {
    this.table = table;
  }

  assign(sentence: string, truth: true | false | undefined) {
    this.table.assign(AnnotationTruthTable.parse(sentence), truth);
    return this;
  }

  true(...sentences: string[]) {
    this.table.true(...sentences.map(AnnotationTruthTable.parse));
    return this;
  }

  false(...sentences: string[]) {
    this.table.false(...sentences.map(AnnotationTruthTable.parse));
    return this;
  }

  evaluate(sentence: string) {
    return this.table.evaluate(AnnotationTruthTable.parse(sentence));
  }

  iterateTruthAssignments() {
    return this.table.iterateTruthAssignments();
  }

  iterateTrueStatements() {
    return this.table.iterateTrueStatements();
  }

  iterateStatements() {
    return this.table.iterateStatements();
  }
  iterateByPredicate(predicate: string) {
    return this.table.iterateByPredicate(predicate);
  }

  findMappings(pattern: string) {
    if (/^!/.test(pattern))
      return this.table.findMappings({
        statement: AnnotationTruthTable.parse(pattern.slice(1)),
        truth: false,
      });
    else
      return this.table.findMappings({
        statement: AnnotationTruthTable.parse(pattern),
        truth: true,
      });
  }

  mapArguments(mapping: { [oldName: string]: string }) {
    return new AnnotationTruthTable(this.table.mapArgs(mapping));
  }
}
