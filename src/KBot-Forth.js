// Generated by CoffeeScript 1.8.0
KBot.Cmds.forth = function(instruct, msgObj) {
  var asplode, curInst, defs, error, haltInst, ifIndex, ifLookup, inst, instn, instructs, item, items, k, qPrint, stack, x, _i, _j, _len;
  curInst = 1;
  asplode = function(inst, type, msg) {
    return ("ERROR >> @" + curInst + ":" + (inst.toUpperCase()) + " >> " + type + ": " + msg + "\n") + ("STACK >> [" + (stack.join(", ")) + "]");
  };
  qPrint = [];
  stack = [];
  haltInst = false;
  ifLookup = {};
  ifIndex = 0;
  defs = {
    "array_explode": {
      fn: function(o) {
        var key, value, _i, _len, _ref;
        o[1] = o[1].replace(/^\"|\"$/g, "");
        o[0] = o[0].replace(/^\"|\"$/g, "");
        o[1] = o[1].split(o[0]);
        _ref = o[1];
        for (key = _i = 0, _len = _ref.length; _i < _len; key = ++_i) {
          value = _ref[key];
          o[1][key] = "\"" + value + "\"";
        }
        return stack.push(o[1]);
      },
      args: ["string", "string"]
    },
    "timefmt": {
      fn: function(o) {
        var pad;
        o[1] = new Date(o[1] * 1e3);
        pad = function(num) {
          if (num < 10) {
            num = "0" + num;
          }
          return "" + num;
        };
        if (o[0].match(/\%DD/g)) {
          o[0] = o[0].replace(/\%DD/g, pad(o[1].getDate()));
        }
        if (o[0].match(/\%MM/g)) {
          o[0] = o[0].replace(/\%MM/g, pad(o[1].getMonth() + 1));
        }
        if (o[0].match(/\%YY/g)) {
          o[0] = o[0].replace(/\%YY/g, o[1].getFullYear() - 2000);
        }
        return stack.push(o[0]);
      },
      args: ["string", "number"]
    },
    "time": {
      fn: function() {
        return stack.push(~~(new Date().getTime() / 1e3));
      },
      args: []
    },
    "then": {
      fn: function() {
        var isRelevant;
        isRelevant = ifLookup[ifIndex] === false || ifLookup[ifIndex];
        if (haltInst && isRelevant) {
          haltInst = false;
          delete ifLookup[ifIndex];
        } else if (isRelevant) {
          delete ifLookup[ifIndex];
        }
        return ifIndex--;
      },
      args: []
    },
    "else": {
      fn: function() {
        if (!ifIndex && !haltInst) {
          return asplode("ELSE", "LOGERR", "ELSE OUT OF SCOPE OF IF-THEN STATEMENT.");
        }
        if (!haltInst && ifLookup[ifIndex]) {
          haltInst = true;
          console.log("ELSE SET HALT", ifLookup[ifIndex]);
        }
        if (haltInst && ifLookup[ifIndex] === false) {
          haltInst = false;
          return console.log("ELSE REMOVE HALT", ifLookup[ifIndex]);
        }
      },
      args: []
    },
    "if": {
      fn: function(o) {
        if (haltInst) {
          ifIndex++;
          return;
        }
        if (o[0] && o[0] !== -1) {
          ifLookup[ifIndex] = true;
          console.log("IF TRUE", ifLookup[ifIndex]);
        } else {
          ifLookup[ifIndex] = false;
          haltInst = true;
          console.log("IF FALSE - SET HALT", ifLookup[ifIndex]);
        }
        return ifIndex++;
      },
      args: ["any"]
    },
    "strlen": {
      fn: function(o) {
        if (defs.hasOwnProperty(o[0])) {
          return asplode("STRLEN", "TYPERR", "CANNOT PERFORM STRING OPERATIONS ON REFERENCE.");
        }
        return stack.push(o[0].length);
      },
      args: ["string"]
    },
    "float?": {
      fn: function(o) {
        if (typeof o[0] === "number" && ~~o[0] !== o[0]) {
          return stack.push(1);
        }
        return stack.push(0);
      },
      args: ["any"]
    },
    "ref?": {
      fn: function(o) {
        if (typeof o[0] === "string" && defs.hasOwnProperty(o[0])) {
          return stack.push(1);
        }
        return stack.push(0);
      },
      args: ["any"]
    },
    "str?": {
      fn: function(o) {
        if (typeof o[0] === "string" && !defs.hasOwnProperty(o[0])) {
          return stack.push(1);
        }
        return stack.push(0);
      },
      args: ["any"]
    },
    "int?": {
      fn: function(o) {
        if (typeof o[0] === "number" && ~~o[0] === o[0]) {
          return stack.push(1);
        }
        return stack.push(0);
      },
      args: ["any"]
    },
    "strcat": {
      fn: function(o) {
        return stack.push("\"" + ((o[1] + o[0]).replace(/^\"|\"$/g, "")) + "\"");
      },
      args: ["string", "string"]
    },
    "rsplit": {
      fn: function(o) {
        var idx, tmp;
        o[1] = o[1].replace(/^\"|\"$/g, "");
        o[0] = o[0].replace(/^\"|\"$/g, "");
        idx = o[1].lastIndexOf(o[0]);
        if (idx === -1) {
          return stack.push(0);
        }
        tmp = o[1].substring(idx + o[0].length);
        o[1] = o[1].substring(0, idx);
        stack.push("\"" + o[1] + "\"");
        return stack.push("\"" + tmp + "\"");
      },
      args: ["string", "string"]
    },
    "split": {
      fn: function(o) {
        var idx, tmp;
        o[1] = o[1].replace(/^\"|\"$/g, "");
        o[0] = o[0].replace(/^\"|\"$/g, "");
        idx = o[1].indexOf(o[0]);
        if (idx === -1) {
          return stack.push(0);
        }
        tmp = o[1].substring(idx + o[0].length);
        o[1] = o[1].substring(0, idx);
        stack.push("\"" + o[1] + "\"");
        return stack.push("\"" + tmp + "\"");
      },
      args: ["string", "string"]
    },
    ".stack": {
      fn: function() {
        return qPrint.push("[" + (stack.join(", ")) + "] @:" + curInst);
      },
      args: []
    },
    "wat": {
      fn: function() {
        return asplode("WAT", "WATERR", "WAT ERROR?");
      },
      args: []
    },
    "rinstr": {
      fn: function(o) {
        o[0] = o[0].replace(/^\"|\"$/g, "");
        return stack.push(o[1].lastIndexOf(o[0]));
      },
      args: ["string", "string"]
    },
    "instr": {
      fn: function(o) {
        o[0] = o[0].replace(/^\"|\"$/g, "");
        return stack.push(o[1].indexOf(o[0]));
      },
      args: ["string", "string"]
    },
    ".\"": {
      fn: function() {
        var string;
        string = [];
        while (instruct[0].indexOf("\"") === -1 && instruct.length) {
          string.push(instruct.shift());
        }
        if (!instruct.length) {
          return asplode(".\"", "STRERR", "UNTERMINATED STRING LITERAL.");
        }
        string.push(instruct.shift());
        return stack.push("\"" + (string.join(" ")));
      },
      args: []
    },
    "toint": {
      fn: function(o) {
        return stack.push(~~o[0]);
      },
      args: ["number"]
    },
    "xor": {
      fn: function(o) {
        return stack.push(o[1] ^ o[0]);
      },
      args: ["number", "number"]
    },
    "or": {
      fn: function(o) {
        return stack.push(o[1] | o[0]);
      },
      args: ["number", "number"]
    },
    "and": {
      fn: function(o) {
        return stack.push(o[1] & o[0]);
      },
      args: ["number", "number"]
    },
    "abs": {
      fn: function(o) {
        return stack.push(Math.abs(o[0]));
      },
      args: ["number"]
    },
    "sqrt": {
      fn: function(o) {
        return stack.push(Math.sqrt(o[0]));
      },
      args: ["number"]
    },
    "pow": {
      fn: function(o) {
        return stack.push(Math.pow(o[1], o[0]));
      },
      args: ["number", "number"]
    },
    "mod": {
      fn: function(o) {
        return stack.push(o[1] % o[0]);
      },
      args: ["number", "number"]
    },
    "*": {
      fn: function(o) {
        return stack.push(o[1] * o[0]);
      },
      args: ["number", "number"]
    },
    "/": {
      fn: function(o) {
        return stack.push((o[1] / o[0]).toPrecision(5));
      },
      args: ["number", "number"]
    },
    "-": {
      fn: function(o) {
        return stack.push(o[1] - o[0]);
      },
      args: ["number", "number"]
    },
    "+": {
      fn: function(o) {
        return stack.push(o[1] + o[0]);
      },
      args: ["number", "number"]
    },
    "dup": {
      fn: function(o) {
        stack.push(o[0]);
        return stack.push(o[0]);
      },
      args: ["any"]
    },
    "over": {
      fn: function(o) {
        stack.push(o[1]);
        stack.push(o[0]);
        return stack.push(o[1]);
      },
      args: ["any", "any"]
    },
    "pop": {
      fn: function(o) {},
      args: ["any"]
    },
    "rot": {
      fn: function(o) {
        stack.push(o[1]);
        stack.push(o[0]);
        return stack.push(o[2]);
      },
      args: ["any", "any", "any"]
    },
    "swap": {
      fn: function(o) {
        stack.push(o[0]);
        return stack.push(o[1]);
      },
      args: ["any", "any"]
    },
    "!": {
      fn: function(o) {
        return defs[o[0]] = o[1];
      },
      args: ["string", "any"]
    },
    "@": {
      fn: function(o) {
        return stack.push(defs[o[0]]);
      },
      args: ["string"]
    },
    "var": {
      fn: function() {
        var next;
        if (!instruct.length) {
          return asplode("VAR", "REFERR", "NO REFERENCE EXTENDS VAR DECLARATION LOOK-AHEAD.");
        }
        next = instruct.shift();
        if (!isNaN(parseInt(next, 10))) {
          return asplode("VAR", "TYPERR", "NON-PSEUDO-STRING DECLARATION ON VAR.");
        }
        if (!next) {
          return asplode("VAR", "REFERR", "NO REFERENCE EXTENDS VAR DECLARATION LOOK-AHEAD.");
        }
        if (defs[next]) {
          return asplode("VAR", "REFERR", "REFERENCE '" + (next.toUpperCase()) + "' ALREADY EXISTS");
        }
        return defs[next] = true;
      },
      args: []
    }
  };
  instruct = instruct.split(" ");
  instructs = instruct.length;
  for (k = _i = 0; 0 <= instructs ? _i < instructs : _i > instructs; k = 0 <= instructs ? ++_i : --_i) {
    if (instruct.length && instruct[0]) {
      inst = instruct.shift();
      if (haltInst) {
        if (inst.match(/if|then|else/g)) {
          error = defs[inst].fn([]);
          if (typeof error === "string" && error.match(/^ERROR /)) {
            return error;
          }
          continue;
        } else {
          continue;
        }
      }
      if (!isNaN(parseInt(inst, 10))) {
        if (inst.indexOf(".") !== -1) {
          stack.push(parseFloat(inst, 10));
          curInst++;
          continue;
        }
        stack.push(parseInt(inst, 10));
        curInst++;
        continue;
      }
      instn = "" + inst;
      inst = defs[inst];
      if (!defs.hasOwnProperty(instn)) {
        return asplode(instn, "DEFERR", "NOT RECOGNIZED.");
      }
      if (inst.args) {
        if (inst.args.length > stack.length) {
          return asplode(instn, "STKERR", "STACK UNDERFLOW.");
        }
        items = (function() {
          var _j, _ref, _results;
          _results = [];
          for (x = _j = 0, _ref = inst.args.length; 0 <= _ref ? _j < _ref : _j > _ref; x = 0 <= _ref ? ++_j : --_j) {
            _results.push(stack.pop());
          }
          return _results;
        })();
        for (k = _j = 0, _len = items.length; _j < _len; k = ++_j) {
          item = items[k];
          if (inst.args[k] !== "any" && typeof item !== inst.args[k]) {
            return asplode(instn, "TYPERR", "ARG " + k + " NOT OF CORRECT TYPE.");
          }
        }
      }
      if (inst.fn) {
        error = inst.fn(items);
        if (typeof error === "string" && error.match(/^ERROR /)) {
          return error;
        }
      } else {
        stack.push(instn);
      }
      curInst++;
    } else {
      instruct.shift();
      break;
    }
  }
  return ("" + (qPrint.length ? qPrint.join("\n") + "\n" : "")) + ("[" + (stack.join(", ")) + "]");
};
