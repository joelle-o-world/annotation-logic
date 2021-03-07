def un_nest(a):
    depth = 0
    result = []
    for i in range(len(a)):
        if a[i] == '[':
            if depth == 0:
                pin = i + 1
            depth += 1
        if a[i] == ']':
            depth -= 1
            if depth == 0:
                result.append(a[pin:i])
            if depth < 0:
                raise Exception('unexpected character: ]')
    return result

def substitute(a, subs):
    depth = 0
    pin = 0
    result = ''
    j = 0
    for i in range(len(a)):
        if a[i] == '[':
            if depth == 0:
                result += a[pin:i] + subs[j]
                j += 1

            depth += 1
        if a[i] == ']':
            depth -= 1
            pin = i + 1
            if depth < 0:
                raise Exception('unexpected character: ]')
    
    result += a[pin:len(a)]

    return result;
                
def sub_nested(a, *subs):
    return substitute(a, [ '['+s+']' for s in subs]);

def wipe_nested(a):
    depth = 0
    pin = 0
    result = ''
    for i in range(len(a)):
        if a[i] == '[':
            if depth == 0:
                result += a[pin:i] + "[]"
            depth += 1

        if a[i] == ']':
            depth -= 1
            pin = i + 1
            if depth < 0:
                raise Exception('unexpected character: ]')
    result += a[pin:len(a)]
    return result

assert un_nest("[the cat =a ] is eating [[the dog =b]'s dinner =c]") == ['the cat =a ', "[the dog =b]'s dinner =c"]



assert sub_nested("[the cat] is eating [[the dog]'s dinner]", "the mouse", "some delicious cheese") == '[the mouse] is eating [some delicious cheese]'
assert sub_nested('[] naps', 'the cat') == '[the cat] naps'
assert wipe_nested('[the cat] naps') == '[] naps'
