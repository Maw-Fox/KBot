KBot.Cmds.forth = (instruct, msgObj) ->
  curInst = 1;
  asplode = (inst, type, msg) ->
    return (
      "ERROR >> @#{curInst}:#{inst.toUpperCase()} >> #{type}: #{msg}\n" +
      "STACK >> [#{stack.join(", ")}]"
     )

  qPrint = []
  stack = []

  haltInst = false
  ifLookup = {}
  ifIndex = 0

  defs =
    "array_explode":
      fn: (o) ->
        o[1] = o[1].replace /^\"|\"$/g, ""
        o[0] = o[0].replace /^\"|\"$/g, ""

        o[1] = o[1].split o[0]

        for value, key in o[1]
          o[1][key] = "\"#{value}\""

        stack.push o[1]
      args: [
        "string"
        "string"
      ]
    "timefmt":
      fn: (o) ->
        o[1] = new Date(o[1] * 1e3)

        pad = (num) ->
          if num < 10
            num = "0" + num
          
          return "" + num

        if o[0].match /\%DD/g
          o[0] = o[0].replace /\%DD/g, pad(o[1].getDate())

        if o[0].match /\%MM/g
          o[0] = o[0].replace /\%MM/g, pad(o[1].getMonth() + 1)

        if o[0].match /\%YY/g
          o[0] = o[0].replace /\%YY/g, o[1].getFullYear() - 2000

        stack.push o[0]
      args: [
        "string"
        "number"
      ]
    "time":
      fn: ->
        stack.push ~~(new Date().getTime() / 1e3)
      args: []
    "then":
      fn: ->
        isRelevant = (
          ifLookup[ifIndex] is false or
          ifLookup[ifIndex]
        )

        if haltInst and isRelevant
          haltInst = false
          delete ifLookup[ifIndex]
        else if isRelevant
          delete ifLookup[ifIndex]

        ifIndex--
      args: []
    "else":
      fn: ->
        if not ifIndex and not haltInst
          return asplode "ELSE",
            "LOGERR",
            "ELSE OUT OF SCOPE OF IF-THEN STATEMENT."

        if not haltInst and ifLookup[ifIndex]
          haltInst = true
          console.log("ELSE SET HALT", ifLookup[ifIndex])

        if haltInst and ifLookup[ifIndex] is false
          haltInst = false
          console.log("ELSE REMOVE HALT", ifLookup[ifIndex])
      args: []
    "if":
      fn: (o) ->
        if haltInst
          ifIndex++
          return
        # if condition is true, continue running until
        # possible else statement on the same depth
        if o[0] and o[0] isnt -1
          ifLookup[ifIndex] = true
          console.log("IF TRUE", ifLookup[ifIndex])
        # If condition is false, trigger halt on instructions
        # Until equal depth of else/then statement
        else
          ifLookup[ifIndex] = false
          haltInst = true
          console.log("IF FALSE - SET HALT", ifLookup[ifIndex])

        ifIndex++
      args: [
        "any"
      ]
    "strlen":
      fn: (o) ->
        if defs.hasOwnProperty(o[0])
          return asplode "STRLEN",
            "TYPERR",
            "CANNOT PERFORM STRING OPERATIONS ON REFERENCE."

        return stack.push o[0].length
      args: [
        "string"
      ]
    "float?":
      fn: (o) ->
        if typeof o[0] is "number" and ~~o[0] isnt o[0]
          return stack.push 1

        return stack.push 0
      args: [
        "any"
      ]
    "ref?":
      fn: (o) ->
        if typeof o[0] is "string" and defs.hasOwnProperty(o[0])
          return stack.push 1

        return stack.push 0
      args: [
        "any"
      ]
    "str?":
      fn: (o) ->
        if typeof o[0] is "string" and not defs.hasOwnProperty(o[0])
          return stack.push 1

        return stack.push 0 
      args: [
        "any"
      ]
    "int?":
      fn: (o) ->
        if typeof o[0] is "number" and ~~o[0] is o[0]
          return stack.push 1

        return stack.push 0 
      args: [
        "any"
      ]
    "strcat":
      fn: (o) ->
        stack.push "\"#{(o[1] + o[0]).replace(/^\"|\"$/g, "")}\""
      args: [
        "string"
        "string"
      ]
    "rsplit":
      fn: (o) ->
        o[1] = o[1].replace /^\"|\"$/g, ""
        o[0] = o[0].replace /^\"|\"$/g, ""

        idx = o[1].lastIndexOf o[0]

        if idx is -1
          return stack.push(0)

        tmp = o[1].substring idx + o[0].length
        o[1] = o[1].substring 0, idx

        stack.push "\"#{o[1]}\""
        stack.push "\"#{tmp}\""
      args: [
        "string"
        "string"
      ]
    "split":
      fn: (o) ->
        o[1] = o[1].replace /^\"|\"$/g, ""
        o[0] = o[0].replace /^\"|\"$/g, ""

        idx = o[1].indexOf o[0]

        if idx is -1
          return stack.push(0)

        tmp = o[1].substring idx + o[0].length
        o[1] = o[1].substring 0, idx

        stack.push "\"#{o[1]}\""
        stack.push "\"#{tmp}\""
      args: [
        "string"
        "string"
      ]
    ".stack":
      fn: ->
        qPrint.push "[#{stack.join ", "}] @:#{curInst}"
      args:[]
    "wat": 
      fn: ->
        return asplode "WAT",
          "WATERR",
          "WAT ERROR?"
      args: []
    "rinstr":
      fn: (o) ->
        o[0] = o[0].replace /^\"|\"$/g, ""
        stack.push o[1].lastIndexOf(o[0])
      args: [
        "string"
        "string"
      ]
    "instr":
      fn: (o) ->
        o[0] = o[0].replace /^\"|\"$/g, ""
        stack.push o[1].indexOf(o[0])
      args: [
        "string"
        "string"
      ]
    ".\"":
      fn: ->
        string = []
        while instruct[0].indexOf("\"") is -1 and instruct.length
          string.push instruct.shift()

        unless instruct.length
          return asplode ".\"", "STRERR", "UNTERMINATED STRING LITERAL."

        string.push instruct.shift()

        stack.push("\"#{string.join(" ")}")          
      args: []
    "toint":
      fn: (o) ->
        stack.push(~~o[0])
      args: [
        "number"
      ]
    "xor":
      fn: (o) ->
        stack.push(o[1] ^ o[0])
      args: [
        "number"
        "number"
      ]
    "or":
      fn: (o) ->
        stack.push(o[1] | o[0])
      args: [
        "number"
        "number"
      ]
    "and":
      fn: (o) ->
        stack.push(o[1] & o[0])
      args: [
        "number"
        "number"
      ]
    "abs":
      fn: (o) ->
        stack.push(Math.abs o[0])
      args: [
        "number"
      ]
    "sqrt":
      fn: (o) ->
        stack.push(Math.sqrt(o[0]))
      args: [
        "number"
      ]
    "pow":
      fn: (o) ->
        stack.push(Math.pow o[1], o[0])
      args: [
        "number"
        "number"
      ]
    "mod":
      fn: (o) ->
        stack.push(o[1] % o[0])
      args: [
        "number"
        "number"
      ]
    "*":
      fn: (o) ->
        stack.push(o[1] * o[0])
      args: [
        "number"
        "number"
      ]
    "/":
      fn: (o) ->
        stack.push((o[1] / o[0]).toPrecision 5)
      args: [
        "number"
        "number"
      ]
    "-":
      fn: (o) ->
        stack.push(o[1] - o[0])
      args: [
        "number"
        "number"
      ]
    "+":
      fn: (o) ->
        stack.push(o[1] + o[0])
      args: [
        "number"
        "number"
      ]
    "dup":
      fn: (o) ->
        stack.push(o[0])
        stack.push(o[0])
      args: [
        "any"
      ]
    "over":
      fn: (o) ->
        stack.push(o[1])
        stack.push(o[0])
        stack.push(o[1])
      args: [
        "any"
        "any"
      ]
    "pop":
      fn: (o) ->
        return
      args: [
        "any"
      ]
    "rot": 
      fn: (o) ->
        stack.push(o[1])
        stack.push(o[0])
        stack.push(o[2])
      args: [
        "any"
        "any"
        "any"
      ]
    "swap":
      fn: (o) ->
        stack.push o[0] 
        stack.push o[1] 
      args: [
        "any"
        "any"
      ]
    "!":
      fn: (o) ->
        defs[o[0]] = o[1]
      args: [
        "string"
        "any"
      ]
    "@":
      fn: (o) ->
        stack.push defs[o[0]]
      args: [
        "string"
      ]
    "var":
      fn: ->
        unless instruct.length
          return asplode "VAR",
            "REFERR", 
            "NO REFERENCE EXTENDS VAR DECLARATION LOOK-AHEAD."

        next = instruct.shift()

        unless isNaN(parseInt next, 10)
          return asplode "VAR",
            "TYPERR",
            "NON-PSEUDO-STRING DECLARATION ON VAR."

        unless next
          return asplode "VAR",
            "REFERR", 
            "NO REFERENCE EXTENDS VAR DECLARATION LOOK-AHEAD."

        if defs[next]
          return asplode "VAR",
            "REFERR",
            "REFERENCE '#{next.toUpperCase()}' ALREADY EXISTS"

        defs[next] = true
      args: []

  instruct = instruct.split(" ")
  instructs = instruct.length

  for k in [0...instructs]
    if instruct.length and instruct[0]
      inst = instruct.shift()
      if haltInst
        if inst.match(/if|then|else/g)
          error = defs[inst].fn([])

          if typeof error is "string" and error.match(/^ERROR /)
            return error

          continue
        else
          continue
      unless isNaN(parseInt inst, 10)
        if inst.indexOf(".") isnt -1
          stack.push parseFloat inst, 10
          curInst++
          continue

        stack.push parseInt(inst, 10)
        curInst++
        continue

      instn = "#{inst}"
      inst = defs[inst]

      unless defs.hasOwnProperty instn
        return asplode instn,
          "DEFERR",
          "NOT RECOGNIZED."

      if inst.args
        if inst.args.length > stack.length
          return asplode instn,
            "STKERR",
            "STACK UNDERFLOW."

        items = (stack.pop() for x in [0...inst.args.length])

        for item, k in items
          if inst.args[k] isnt "any" and typeof item isnt inst.args[k]
            return asplode instn,
              "TYPERR",
              "ARG #{k} NOT OF CORRECT TYPE."

      if inst.fn
        error = inst.fn(items)

        if typeof error is "string" and error.match(/^ERROR /)
          return error
      else 
        stack.push(instn)
      curInst++
    else
      instruct.shift()
      break

  return (
    "#{if qPrint.length then qPrint.join("\n") + "\n" else ""}" +
    "[#{stack.join(", ")}]"
  )