import TruthTable from "./TruthTable";

function parse(str: string) {
  let result = /(\w+)\((.*)\)/.exec(str);
  if (!result)
    throw new Error(`Cannot parse L1 style sentence: ${JSON.stringify(str)}`);

  return {
    predicate: result[1],
    arguments: result[2].split(",").map((arg) => arg.trim()),
  };
}
