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

  function parseArguments(data: IParseArgumentsOptions): any[] {
    for (let i = 0, ii = data.command.arguments.length; i < ii; i++) {
      let parameter = data.parameters[i];

      if (parameter === null && !data.command.arguments[i].required) {
        continue;
      }

      if (!parameter && data.command.arguments[i].required) {
        _respond(data.channel, `Missing mandatory argument #${i + 1}.`);
        return null;
      }

      if (data.command.arguments[i].type === Number) {
        parameter = parseFloat(parameter);

        if (!parameter) {
          _respond(
            data.channel, 
            `Argument [b]${i + 1}[/b] is not a valid number.`
          );
          return null;
        }
      }

      if (parameter.constructor !== data.command.arguments[i].type) {
        _respond(
          data.channel,
          `Argument [b]${i + 1}[/b] is not of type [b]${
            _typeToString(data.command.arguments[i].type)
          }[/b].`
        );
        return null;
      }

      if (data.command.arguments[i].type === Number) {
        data.parameters[i] = parseFloat(parameter);
      }
    }

    return data.parameters;
  }

  function respondUser(): void {
    FList.Chat.printMessage({
      msg: _sanitizeOwnMessage(this.message),
      to: this.channel,
      from: FList.Chat.identity,
      type: 'chat',
      log: true
    });

    FList.Connection.send(`PRI ${
      JSON.stringify({
        message: this.message,
        recipient: this.channel.id
      })
      }`);
    return;
  }

  function respondChannel(): void {
    FList.Chat.printMessage({
      msg: _sanitizeOwnMessage(this.message),
      to: this.channel,
      from: FList.Chat.identity,
      type: 'chat',
      log: true
    });

    FList.Connection.send(`MSG ${
      JSON.stringify({
        message: this.message,
        channel: this.channel.id
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

    responseQueue.push(responseFunction.bind({
      channel: tab,
      message: message
    }));
    return;
  }

  export function _getDisplayName(name: string): string {
    const key = Commands.nickname.nicknamesKey.indexOf(name);

    if (key === -1) {
      return name;
    }

    return Commands.nickname.nicknames[key];
  }

  export function read(data: IHookArgs): void {
    const end = data.message.indexOf(' ') !== -1 ?
      data.message.indexOf(' ') : data.message.length;
    var command: ICommand;
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

    if (command.arguments) {
      parameters = parseArguments({
        command: command,
        channel: data.channel,
        parameters: parameters
      });
    }

    if (!parameters) {
      return;
    }

    try {
      command.func.call({
        channel: data.channel,
        user: data.name
      }, parameters);
    } catch (error) {
      _respond(data.channel,
        `Whoops! Something bad happened: [b]${error.message}[/b]: [i]${
          error.stack
        }[/i]`
      );
    }
  }
}
