/**
 * Retrieves the nested arguments from an argstring.
 */
export function un_nest(arg: string): string[] {
  let depth = 0;
  let result = [];
  let pin: number;
  for (let i = 0; i < arg.length; ++i)
    if (arg[i] == "[") {
      if (depth == 0) pin = i + 1;
      ++depth;
    } else if (arg[i] == "]") {
      --depth;
      if (depth == 0) result.push(arg.slice(pin, i));
      else if (depth < 0) throw new Error("unexpected character: ]");
    }
  return result;
}

export function substitute(a: string, subs: string[]) {
  let depth = 0,
    pin = 0,
    result = "",
    j = 0;

  for (let i = 0; i < a.length; ++i)
    if (a[i] == "[") {
      if (depth == 0) {
        result += a.slice(pin, i) + subs[j];
        ++j;
      }
      ++depth;
    } else if (a[i] == "]") {
      --depth;
      pin = i + 1;
      if (depth < 0) throw new Error("unexpected character: ]");
    }

  result += a.slice(pin);

  return result;
}

/**
 * Like `substitute()` but wraps the substitutions in square brackets
 */
export function substitute_nested(a: string, subs: string[]): string {
  return substitute(
    a,
    subs.map((s) => `[${s}]`)
  );
}

/**
 * Substitutes args with empty square brackets `'[]'`
 */
export function wipe_nested(a: string) {
  let depth = 0,
    pin = 0,
    result = "";

  // For every char in `a`
  for (let i = 0; i < a.length; ++i) {
    if (a[i] == "[") {
      if (depth == 0) result += a.slice(pin, i) + "[]";
      ++depth;
    } else if (a[i] === "]") {
      --depth;
      pin = i + 1;
      if (depth < 0) throw new Error("unexpected character: ]");
    }
  }

  result += a.slice(pin);

  return result;
}

export function getDepth(a: string) {
  let depth = 0;
  let maxDepth = 0;

  for (let i = 0; i < a.length; ++i) {
    if (a[i] == "[") {
      ++depth;
      if (depth > maxDepth) maxDepth = depth;
    } else if (a[i] == "]") --depth;
  }

  return maxDepth;
}

export function hasMaxDepth(a: string, maxDepth = 1) {
  let depth = 0;
  for (let i = 0; i < a.length; ++i) {
    if (a[i] == "[") {
      ++depth;
      if (depth > maxDepth) return false;
    } else if (a[i] == "]") --depth;
  }

  // Otherwise,
  return true;
}

export function isShallow(a: string) {
  return hasMaxDepth(a, 1);
}

export function assertShallow(x: string): true {
  if (isShallow(x)) return true;
  else throw `Expected shallow argument, got ${x}`;
}

export function standardForm(x: string): string {
  // TODO
}

export function deepParse(x: string): string {
  // TODO
}

export function getPredicate(x: string): string {
  return wipe_nested(x);
}

export function* iterateBits(x: string): Generator<{
  kind: "nested arg" | "literal" | "assignment" | "white-space";
  str: string;
}> {
  // TODO
}

export function* getAssignments(x: string): Generator<string> {
  // TODO: Make this less wasteful
  const flat = wipe_nested(x);
  const reg = /=\w+/g;
  let match;
  while ((match = reg.exec(flat))) yield match[0].slice(1);
}

export function getFirstAssignment(x: string): string | null {
  const [a] = getAssignments(x);
  if (a) return a;
  else return null;
}

export function getAssignment(x: string): string | null {
  const assignments = [...getAssignments(x)];
  if (assignments.length !== 1) throw `Expected 1 assignment: ${x}`;
  else return assignments[0];
}

export function setAssignment(statement: string, assignment: string): string {
  // TODO: Optimise
  if (assignment && assignment.length)
    return `${wipeAssignments(statement)} =${assignment}`;
  else return wipeAssignments(statement);
}

/**
 * (shallow)
 */
export function wipeAssignments(statement: string): string {
  // TODO: Optimise
  return substitute_nested(
    wipe_nested(statement).replace(/(?<=^|\s+)=\w+(\s+|$)/g, ""),
    un_nest(statement)
  );
}

export function getOneWordPredicate(x: string): string {
  // TODO
}

export function logicNotation(x: string): string {
  // TODO
}

export function getMapping(
  variables: string[],
  from: string,
  onto: string
): { [variable: string]: string } {
  let mapping = {};
  if (getPredicate(from) !== getPredicate(onto)) {
    return null;
  } else {
    let fromNested = un_nest(from);
    let ontoNested = un_nest(onto);
    if (fromNested.length !== ontoNested.length)
      // TODO: remove this
      throw "This shouldn't happen";
    for (let i = 0; i < fromNested.length; ++i) {
      let x = getAssignment(fromNested[i]);
      let y = getAssignment(ontoNested[i]);
      if (variables.includes(x)) {
        if (mapping[x] !== undefined && mapping[x] !== y) return null;
        else mapping[x] = y;
      } else {
        if (x !== y) return null;
        else continue;
      }
    }
    if (Object.keys(mapping).length > 0) return mapping;
    else return null;
  }
}

export function deepMapAssignments(
  mapping: { [variable: string]: string },
  statement: string
): string {
  // TODO: consider using simple string replacement..
  for (let variable in mapping) {
    statement = statement.replace(
      new RegExp(`(?<=^|\\s+)=${variable}(?=\\s+|$)`, "g"),
      `=${mapping[variable]}`
    );
  }
  return statement

  //let assignment = getFirstAssignment(statement);
  //let mappedAssignment = mapping[assignment] || assignment;
  //return setAssignment(
    //substitute_nested(
      //statement,
      //un_nest(statement).map((x) => deepMapAssignments(mapping, x))
    //),
    //mappedAssignment
  //);
}

// TODO: Choose a better name
export function compare(a: string, b: string): boolean {
  if (getPredicate(a) !== getPredicate(b)) return false;
  let aArgs = un_nest(a).map((nestedArg) => getAssignment(nestedArg));
  let bArgs = un_nest(b).map((nestedArg) => getAssignment(nestedArg));
  return (
    aArgs.length === bArgs.length &&
    aArgs.every((arg, i) => aArgs[i] === bArgs[i])
  );
}
