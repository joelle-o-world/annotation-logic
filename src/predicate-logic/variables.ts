export function isVariable(arg: string): arg is Variable {
  // Anything beginning with an underscore
  return /^_/.test(arg);
}

export type Variable = `_${string}`;
