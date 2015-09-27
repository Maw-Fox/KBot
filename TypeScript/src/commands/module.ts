/**
 * KBot -- Commands: Module
 * @author Kali@F-List.net
 */

/// <reference path="../bot.d.ts" />
/// <reference path="interfaces.ts" />

module KBot {
	export module Commands {
		export const help: Command = {
			arguments: [
				{
					name: 'command',
					type: String,
					required: false
				}
			],
			help: 'Gives you either a command listing or a command\'s' +
				' description and syntax',
			func: function(arguments: string[]): void {
				const command = arguments[0];
				var output = '';
				var params: CommandArgument[];

				if (!command) {
					output += `Commands: [${CommandKeys.join(', !')}]`;
					_respond(this, output);
					return;
				}

				params = Commands[command].arguments;

				if (!Commands[command]) {
					_respond(this, 'This command does not exist.');
					return;
				}

				output += `Helpfile for: [b]${command}[/b]\n`;

				for (let i = 0, ii = params.length; i < ii; i++) {

				}

				_respond(this, output);
			}
		}

		export const daysToMinutes: Command = {
			arguments: [
				{
					name: 'days',
					type: Number,
					required: true
				}
			],
			help: 'Return sum of minutes for the specified number of days.',
			func: function(days: number): void {
				_respond(this, days * 24 * 60 + '');
			}
		}
	}

	export const CommandKeys = (function(): string[] {
		const commands: string[] = [];

		for (let command in Commands) {
			if (Commands.hasOwnProperty(command)) {
				commands.push(command);
			}
		}
		return commands;
	}());
}