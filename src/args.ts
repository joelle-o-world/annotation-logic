/**
 * Retrieves the nested arguments from an argstring.
 */
export function un_nest(arg: string) {
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
export function substitue_nested(a: string, subs: string[]) {
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
  if (assignments.length > 1) throw `Expected 1 or 0 assignments: ${x}`;
  else return assignments[0] || null;
}
