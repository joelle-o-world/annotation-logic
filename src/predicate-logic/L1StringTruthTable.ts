import TruthTable from "./TruthTable";

export default class L1StringTruthTable {
  private table: TruthTable;
  private static parse(str: string) {
    let result = /(\w+)\((.*)\)/.exec(str);
    if (!result)
      throw new Error(`Cannot parse L1 style sentence: ${JSON.stringify(str)}`);

    return {
      predicate: result[1],
      arguments: result[2].split(",").map((arg) => arg.trim()),
    };
  }

  constructor(table = new TruthTable()) {
    this.table = table;
  }

  assign(sentence: string, truth: true | false | undefined) {
    this.table.assign(L1StringTruthTable.parse(sentence), truth);
    return this;
  }

  true(...sentences: string[]) {
    this.table.true(...sentences.map(L1StringTruthTable.parse));
    return this;
  }

  false(...sentences: string[]) {
    this.table.false(...sentences.map(L1StringTruthTable.parse));
    return this;
  }

  evaluate(sentence: string) {
    return this.table.evaluate(L1StringTruthTable.parse(sentence));
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
        statement: L1StringTruthTable.parse(pattern.slice(1)),
        truth: false,
      });
    else
      return this.table.findMappings({
        statement: L1StringTruthTable.parse(pattern),
        truth: true,
      });
  }

  mapArguments(mapping: { [oldName: string]: string }) {
    return new L1StringTruthTable(this.table.mapArgs(mapping));
  }
}
