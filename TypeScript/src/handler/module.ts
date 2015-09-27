/**
 * KBot -- Handler: Module
 * @author Kali@F-List.net
 */

/// <reference path="../bot.d.ts" />
/// <reference path="interfaces.ts" />

void function(): void {
  if (KBot && KBot.tick) {
    clearInterval(KBot.tick);
    KBot.responseQueue.length = 0;
  }
  return;
} ();

module KBot {
  export const responseQueue: Array<() => void> = [];
  export const tick = setInterval(onTick, 750);

  function onTick(): void {
    if (responseQueue.length) {
      responseQueue.shift()();
      return;
    }
    return;
  }

  function parseArguments(command: Command, parameters: any[]): any[] {
    for (let i = 0, ii = command.arguments.length; i < ii; i++) {
      let parameter = parameters[i];

      if (parameter === null && !command.arguments[i].required) {
        continue;
      }

      if (!parameter && command.arguments[i].required) {
        _respond(this, `Missing mandatory argument #${i + 1}.`);
        return null;
      }

      if (command.arguments[i].type === Number) {
        parameter = parseFloat(parameter);

        if (!parameter) {
          _respond(this, `Argument [b]${i + 1}[/b] is not a valid number.`);
          return null;
        }
      }

      if (parameter.constructor !== command.arguments[i].type) {
        _respond(this, `Argument [b]${i + 1}[/b] is not of type [b]${
            _typeToString(command.arguments[i].type)
          }[/b].`);
        return null;
      }

      if (command.arguments[i].type === Number) {
        parameters[i] = parseFloat(parameter);
      }
    }

    return parameters;
  }

  function respondUser(tab: ChannelObject, message: string): void {
    FList.Chat.printMessage({
      msg: _sanitizeOwnMessage(message),
      to: tab,
      from: FList.Chat.identity,
      type: 'chat',
      log: true
    });
    FList.Connection.send(`PRI ${
      JSON.stringify({
        message: message,
        recipient: tab.id
      })
      }`);
    return;
  }

  function respondChannel(tab: ChannelObject, message: string): void {
    FList.Chat.printMessage({
      msg: _sanitizeOwnMessage(message),
      to: tab,
      from: FList.Chat.identity,
      type: 'chat',
      log: true
    });
    FList.Connection.send(`MSG ${
      JSON.stringify({
        message: message,
        channel: tab.id
      })
      }`);
    return;
  }

  export function _typeToString(type: any): string {
    return type
      .toSource()
      .slice(9, type
        .toSource()
        .indexOf('(')
      )
      .toLowerCase();
  }

  export function _sanitizeOwnMessage(message: string): string {
    return message.replace(/\</g, '&lt;')
      .replace(/\>/g, '&gt;');
  }

  export function _respond(tab: ChannelObject, message: string, override?: boolean): void {
    var responseFunction: (tab: ChannelObject, message: string) => void;
    var overrideFunction: (tab: ChannelObject, message: string) => void;

    message = '[b]KBot[/b]>> ' + message;

    if (tab.type === 'user') {
      responseFunction = respondUser;
      overrideFunction = respondChannel;
    } else {
      responseFunction = respondChannel;
      overrideFunction = respondUser;
    }

    if (override) {
      responseFunction = overrideFunction;
      message += ' [SENT TO PRIVATE]';
    }

    responseQueue.push(responseFunction.bind(this, tab, message));
    return;
  }

  export function read(data: HookArgs): void {
    const end = data.message.indexOf(' ') !== -1 ?
      data.message.indexOf(' ') : data.message.length;
    var command: Command;
    var parameters: any[];
    
    command = Commands[data.message.slice(1, end)];

    if (data.message.charAt(0) !== '!' || !command) {
      return;
    }

    if (data.message.indexOf(' ') === -1) {
      parameters = [null];    
    } else {
      parameters = data.message
        .substr(data.message.indexOf(' ') + 1)
        .replace(/[ ]+/g, ' ')
        .split(' ');
    }

    parameters = parseArguments.call(data.channel, command, parameters);

    if (!parameters) {
      return;
    }

    command.func.call(data.channel, parameters);
  }
}
