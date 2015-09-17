/**
 * KBot -- Handler: Module
 * @author Kali@F-List.net
 */

/// <reference path="../bot.d.ts" />
/// <reference path="interfaces.ts" />

void function(): void {
	if (KBot.tick) {
		clearInterval(KBot.tick);
		KBot.responseQueue.length = 0;
	}
	return;
}();

module KBot {
	function sanitizeOwnMessage(message: string): string {
		return message.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
	}

	function respond(tab: ChannelObject, message: string, override?: boolean): void {
		var responseFunction: (tab: ChannelObject, message: string) => void;
		var overrideFunction: (tab: ChannelObject, message: string) => void;

		message = '[b]KBot[/b]>> ' + message;

		function respondUser(tab: ChannelObject, message: string): void {
			FList.Chat.printMessage({
				msg: sanitizeOwnMessage(message),
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
				msg: sanitizeOwnMessage(message),
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

		responseQueue.push(responseFunction.bind(this, [tab, message]));
		return;
	}

	function onTick() {
		if (responseQueue.length) {
			responseQueue.shift()();
			return;
		}
		return;
	}
	
	export var responseQueue: Array<() => void> = [];
	export var tick = setInterval(onTick, 750);

	export function read(data: HookArgs): void {
		var command: Command;
		var parameters: string[];

		if (data.message.charAt(0) !== '!') {
			return;
		}

		command = Commands[data.message.slice(1, data.message.indexOf(' '))];

		if (!command) {
			return;
		}

		parameters = data.message.substr(data.message.indexOf(' ') + 1)
			.replace(/[ ]+/g, ' ')
			.split(' ');

		// Argument checking
		for (let i = 0, ii = command.arguments.length; i < ii; i++) {
			let parameter = parameters[i];

			if (!parameter && command.arguments[i].required) {
				respond(data.channel, `Missing mandatory argument #${i + 1}.`);
				return;
			}
		}
		return;
	}
}