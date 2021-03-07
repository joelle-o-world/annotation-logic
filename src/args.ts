/**
 * Retrieves the nested arguments from an argstring.
 */
export function un_nest(arg: string) {
  let depth = 0
  let result = []
  let pin: number
  for(let i=0; i < arg.length; ++i)
    if(arg[i] == '[') {
      if( depth == 0)
        pin = i + 1
    ++depth
    } else if(arg[i] == ']') {
      --depth
      if(depth == 0)
        result.push(arg.slice(pin, i))
      else if (depth < 0)
        throw new Error("unexpected character: ]")
    }
 

  return result
}

export function substitute(a: string, subs: string[]) {
  let depth = 0,
    pin = 0,
    result = '',
    j=0

  for(let i=0; i < a.length; ++i)
    if(a[i] == '[') {
      if(depth == 0) {
        result += a.slice(pin, i) + subs[j]
        ++j
      }
      ++depth
    } else if(a[i] == ']') {
      --depth
      pin = i + 1
      if(depth < 0)
        throw new Error("unexpected character: ]")
    }

  result += a.slice(pin)

  return result
}

/**
 * Like `substitute()` but wraps the substitutions in square brackets
 */
export function substitue_nested(a:string, subs: string[]) {
  return substitute(a, subs.map(s => `[${s}]`))
}

/**
 * Substitutes args with empty square brackets `'[]'`
 */
export function wipe_nested(a: string) {
  let depth = 0,
    pin = 0,
    result = ''
  
  // For every char in `a`
  for(let i=0; i < a.length; ++i) {
    if(a[i] == '[') {
      if(depth == 0)
        result += a.slice(pin, i) + '[]'
      ++depth
    } else if(a[i] === ']') {
      --depth
      pin = i + 1
      if(depth < 0)
        throw new Error('unexpected character: ]');
    }
  }

  result += a.slice(pin)

  return result
}
